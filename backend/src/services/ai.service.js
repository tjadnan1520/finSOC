const { client, modelName } = require('../config/gemini');
const ApiError = require('../utils/apiError');

const getAIRecommendation = async (data) => {
  try {
    const prompt = buildOperationalAnalysisPrompt(data);
    const result = await client.models.generateContent({
      model: modelName,
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    const rawResponse = result.candidates?.[0]?.content?.parts?.[0]?.text || '';
    if (!rawResponse) throw new ApiError(502, 'Empty response from AI service');

    return parseGeminiResponse(rawResponse);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(502, `AI service error: ${error.message}`);
  }
};

const buildOperationalAnalysisPrompt = (data) => {
  return `You are a Senior Financial Operations Analyst for an AI-Powered Financial Operations Decision Intelligence Platform. Analyze the following transaction and operational data. Provide a structured JSON response only.

Analyze based on:
- Transaction amount, type, and context
- Current liquidity position and score
- Operational risk assessment
- Provider balance distribution
- Forecast predictions

Transaction Data:
${JSON.stringify(data.transaction || {}, null, 2)}

Liquidity Data:
${JSON.stringify(data.liquidity || {}, null, 2)}

Risk Assessment:
${JSON.stringify(data.risk || {}, null, 2)}

Forecast Data:
${JSON.stringify(data.forecast || {}, null, 2)}

Provider Data:
${JSON.stringify(data.providers || {}, null, 2)}

Respond with valid JSON only:
{
  "summary": "Brief 1-2 sentence operational summary",
  "reason": "Detailed reason for this analysis outcome",
  "recommendation": "Clear actionable recommendation for operations",
  "confidence": <number between 0 and 100>,
  "uncertainty": <number between 0 and 100>
}`;
};

const parseGeminiResponse = (raw) => {
  try {
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return {
        summary: 'AI analysis completed',
        reason: 'Could not parse structured response',
        recommendation: 'Review transaction manually',
        confidence: 50,
        uncertainty: 50,
      };
    }

    const parsed = JSON.parse(jsonMatch[0]);
    return {
      summary: parsed.summary || 'AI analysis completed',
      reason: parsed.reason || 'Analysis performed',
      recommendation: parsed.recommendation || 'Monitor transaction',
      confidence: Math.min(100, Math.max(0, Number(parsed.confidence) || 50)),
      uncertainty: Math.min(100, Math.max(0, Number(parsed.uncertainty) || 30)),
    };
  } catch (error) {
    return {
      summary: 'AI analysis completed',
      reason: 'Response parsing encountered an issue',
      recommendation: 'Review transaction details manually',
      confidence: 40,
      uncertainty: 60,
    };
  }
};

module.exports = { getAIRecommendation, parseGeminiResponse };
