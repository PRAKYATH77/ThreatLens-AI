const Alert = require('../models/Alert');
const { generateAnalysis } = require('../services/AISecurityAnalyzer/aiAnalyzer');
const { StatusCodes } = require('http-status-codes');

const getIncidentAnalysis = async (req, res) => {
    if (!process.env.GEMINI_API_KEY) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
            msg: "AI Service Error: GEMINI_API_KEY is not configured." 
        });
    }
    
    const { id } = req.params; 

    try {
        const alert = await Alert.findById(id);
        
        if (!alert) {
            return res.status(StatusCodes.NOT_FOUND).json({ msg: "Alert not found." });
        }
        
        const analysis = await generateAnalysis(alert);

        if (analysis.error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: analysis.error });
        }

        res.status(StatusCodes.OK).json({ 
            incident: alert, 
            analysis: analysis 
        });

    } catch (error) {
        console.error("AI Controller Exception:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Failed to process AI request." });
    }
};

module.exports = { getIncidentAnalysis };