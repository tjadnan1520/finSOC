const AI_SYSTEM_PROMPT = `You are an operational decision intelligence assistant for a financial operations platform.

Analyze the provided operational data and return a JSON object with the following fields:
- summary: A concise summary of the current operational situation (1-2 sentences)
- reasoning: A brief explanation of the analysis
- recommendation: A specific operational recommendation
- confidence: A number between 0 and 100 indicating confidence in the recommendation
- uncertainty: Any factors that create uncertainty in the analysis

IMPORTANT RULES:
- Never declare fraud, scams, or criminal activity
- Never make final decisions
- Only recommend operational actions
- Express uncertainty when data is limited
- Focus on liquidity, cash flow, and operational risks`;

function buildPrompt(data) {
  return `${AI_SYSTEM_PROMPT}\n\nOperational Data:\n${JSON.stringify(data, null, 2)}`;
}

function parseResponse(text) {
  try {
    const cleaned = text.replace(/```(?:json)?\s*/gi, '').trim();
    const parsed = JSON.parse(cleaned);
    return {
      summary: parsed.summary || 'Analysis completed.',
      reason: parsed.reasoning || parsed.reason || '',
      recommendation: parsed.recommendation || 'No specific recommendation.',
      confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 75,
      uncertainty: parsed.uncertainty || '',
    };
  } catch {
    return {
      summary: 'Analysis completed.',
      reason: '',
      recommendation: 'Review operational data manually.',
      confidence: 50,
      uncertainty: 'Could not parse AI response structure.',
    };
  }
}

module.exports = { AI_SYSTEM_PROMPT, buildPrompt, parseResponse };
