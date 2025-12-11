// backend/services/AISecurityAnalyzer/aiAnalyzer.js
const axios = require("axios");
require('dotenv').config(); // Ensure .env is loaded

// Helper to clean Markdown formatting often returned by LLMs
const extractJson = (text) => {
  if (!text) return null;
  // Removes ```json and ``` if present
  const cleaned = text.replace(/```json|```/g, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch (e) {
    console.warn("⚠ OpenRouter returned non-JSON — fallback response used");
    return {
      RootCause: "AI Analysis format error",
      PlainEnglishSummary: cleaned,
      RemediationAction: "// Manual review required",
    };
  }
};

const generateAnalysis = async (alert) => {
  // Safety Check
  const apiKey = process.env.OPENROUTER_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) {
      console.error("AI Error: OPENROUTER_API_KEY or GEMINI_API_KEY is missing in .env");
      return { error: "API Key missing on server." };
  }

  try {
    // If no meaningful payload, return a template response
    if (!alert.payload || alert.payload === 'N/A') {
      return {
        RootCause: `A ${alert.type} security event was detected on the system.`,
        PlainEnglishSummary: `This ${alert.severity} severity alert indicates a potential ${alert.type} attack vector. Review the alert details and access logs for confirmation.`,
        RemediationAction: `1. Review access logs for the timestamp: ${alert.timestamp}\n2. Check for unauthorized access attempts\n3. Apply input validation and sanitization\n4. Enable Web Application Firewall (WAF) rules`
      };
    }

    const prompt = `You are a cybersecurity expert analyzing a real security threat. Be precise and factual - do NOT hallucinate or make up information.

ALERT DATA:
- Threat Type: ${alert.type}
- Severity Level: ${alert.severity}
- Detected Payload: ${alert.payload}
- Timestamp: ${alert.timestamp}

INSTRUCTIONS:
Analyze ONLY the provided data. Do not invent details. Respond with ONLY valid JSON:

{
  "RootCause": "Brief technical explanation of what caused this specific threat (1-2 sentences)",
  "PlainEnglishSummary": "Simple explanation of the impact and why it matters (1-2 sentences)",
  "RemediationAction": "Specific fix or mitigation step based on the threat type"
}

Return ONLY the JSON object, nothing else.`;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.2,
        max_tokens: 350
      },
      {
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "HTTP-Referer": "http://localhost:5000",
          "X-Title": "ThreatLens-AI"
        }
      }
    );

    const responseText = response.data.choices[0].message.content;
    const analysis = extractJson(responseText);
    
    // Validate response has required fields
    if (!analysis || !analysis.RootCause) {
      return {
        RootCause: `A ${alert.type} security event was detected.`,
        PlainEnglishSummary: `This ${alert.severity} severity alert needs manual review.`,
        RemediationAction: "Review the payload and access logs for more context."
      };
    }
    
    return analysis;
    
  } catch (err) {
    console.error("OpenRouter API Error:", err.response?.data || err.message);
    return { 
      error: "AI analysis failed",
      RootCause: `${alert.type} threat detected`,
      PlainEnglishSummary: "Please review the threat details in the dashboard",
      RemediationAction: "Manual investigation required"
    };
  }
};

module.exports = { generateAnalysis };