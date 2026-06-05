module.exports = {
    // Basic SQL Injection keywords/patterns
    SQL_INJECTION: [
        /select.+from/i,
        /union.+select/i,
        /--/i,
        /(\b(and|or)\b\s+['"]?1['"]?\s*=\s*['"]?1['"]?)/i, // AND 1=1
        /xp_cmdshell/i,
    ],
    // Basic Cross-Site Scripting (XSS) patterns
    XSS: [
        /<script\b[^>]*>(.*?)<\/script>/i,
        /onerror/i,
        /onload/i,
        /alert\s*\(/i,
        /javascript:/i,
    ],
    // Common Scanner/Bot detection headers/patterns
    SCANNER_ACTIVITY: [
        /nessus/i,
        /acunetix/i,
        /dirbuster/i,
    ]
};