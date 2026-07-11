const { GoogleGenAI } = require('@google/genai');
const config = require('./env');

const client = new GoogleGenAI({ apiKey: config.gemini.apiKey });

module.exports = { client, modelName: config.gemini.model };
