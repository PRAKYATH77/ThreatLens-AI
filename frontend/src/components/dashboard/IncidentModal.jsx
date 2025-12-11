import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';

const ModalWrapper = ({ children, onClose }) => (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4">
        <div className="bg-primary-bg p-8 max-w-4xl w-full rounded-lg shadow-2xl relative border border-gray-700">
            {children}
        </div>
    </div>
);

const IncidentModal = ({ alertId, onClose }) => {
    const [loading, setLoading] = useState(true);
    const [report, setReport] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAnalysis = async () => {
            try {
                // Ensure we hit the backend /ai route
                const response = await axiosInstance.get(`/ai/analyze/${alertId}`);
                setReport(response.data);
            } catch (err) {
                console.error(err);
                setError(err.response?.data?.msg || "Analysis failed. Check backend API Key.");
            } finally {
                setLoading(false);
            }
        };
        if(alertId) fetchAnalysis();
    }, [alertId]);

    if (loading) return <ModalWrapper>
        <div className="text-center text-text-light animate-pulse">
            <h3 className="text-xl">🤖 AI is analyzing the threat...</h3>
            <p className="text-sm text-gray-400">Querying Gemini 1.5 Flash</p>
        </div>
    </ModalWrapper>;

    if (error) return <ModalWrapper onClose={onClose}>
        <p className="text-accent-red mb-4">Error: {error}</p>
        <button onClick={onClose} className="py-2 px-4 bg-gray-700 text-white rounded">Close</button>
    </ModalWrapper>;
    
    if (!report || !report.analysis) return null;

    return (
        <ModalWrapper onClose={onClose}>
            <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-accent-red">Incident Analysis</h2>
                <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">&times;</button>
            </div>

            <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
                {/* Summary */}
                <div className="bg-secondary-bg p-4 rounded border border-gray-700">
                    <h4 className="text-accent-green font-semibold mb-1">Plain English Summary</h4>
                    <p className="text-text-light text-sm">{report.analysis.PlainEnglishSummary}</p>
                </div>

                {/* Root Cause */}
                <div className="bg-secondary-bg p-4 rounded border border-gray-700">
                    <h4 className="text-blue-400 font-semibold mb-1">Technical Root Cause</h4>
                    <p className="text-gray-300 text-sm font-mono">{report.analysis.RootCause}</p>
                </div>

                {/* Remediation */}
                <div className="bg-gray-900 p-4 rounded border border-gray-700">
                    <h4 className="text-yellow-400 font-semibold mb-2">Recommended Fix</h4>
                    <pre className="text-xs text-green-400 font-mono overflow-x-auto whitespace-pre-wrap">
                        {report.analysis.RemediationAction}
                    </pre>
                </div>
            </div>

            <div className="mt-6 flex justify-end">
                <button onClick={onClose} className="py-2 px-6 bg-accent-green text-white font-bold rounded hover:bg-green-600 transition">
                    Acknowledge
                </button>
            </div>
        </ModalWrapper>
    );
};

export default IncidentModal;