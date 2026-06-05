# 🛡️ ThreatLens Alert Generator Guide

## How to Generate Security Alerts

You now have multiple ways to generate real security alerts in your ThreatLens system:

---

## 📋 Option 1: Interactive Menu (Recommended for Testing)

This is the easiest way to manually trigger different types of alerts:

```bash
cd backend
node test-alerts-interactive.js
```

Then select from the menu:
- **1** = SQL Injection Alert
- **2** = XSS Alert  
- **3** = Brute Force Alert
- **4** = Reconnaissance Alert
- **5** = Scanner Detection Alert
- **6** = Data Exfiltration Alert
- **a** = Run All Tests
- **r** = Random Test
- **q** = Quit

Each alert will be created and appear **instantly on your dashboard** with full threat source information!

---

## 🔌 Option 2: Direct API Calls (For Automation)

You can call the test endpoints directly using curl or Postman:

### SQL Injection Alert
```bash
curl -X POST http://127.0.0.1:5000/api/test/sql-injection \
  -H "Content-Type: application/json" \
  -d '{"payload":"'"'"' OR '"'"'1'"'"'='"'"'1"'"}'
```

### XSS Alert
```bash
curl -X POST http://127.0.0.1:5000/api/test/xss \
  -H "Content-Type: application/json" \
  -d '{"payload":"<img src=x onerror=\"alert('"'"'XSS'"'"')\">"}'
```

### Brute Force Alert
```bash
curl -X POST http://127.0.0.1:5000/api/test/brute-force \
  -H "Content-Type: application/json" \
  -d '{"attempts":50}'
```

### Reconnaissance Alert
```bash
curl -X POST http://127.0.0.1:5000/api/test/reconnaissance \
  -H "Content-Type: application/json" \
  -d '{"endpoint_count":25}'
```

### Scanner Detection
```bash
curl -X POST http://127.0.0.1:5000/api/test/scanner \
  -H "Content-Type: application/json" \
  -d '{}'
```

### Data Exfiltration Alert
```bash
curl -X POST http://127.0.0.1:5000/api/test/data-exfiltration \
  -H "Content-Type: application/json" \
  -d '{"file_size_mb":500}'
```

---

## 🎮 Option 3: Postman Collection

You can import these endpoints into Postman:

1. Open Postman
2. Create new requests for each endpoint above
3. Copy the API URL and payload
4. Send the request
5. Watch the alert appear on your dashboard!

---

## 📊 What Each Alert Includes

Every alert generated includes:

✅ **Threat Source Information**
- Detection source (Scanner, Detector, Firewall, API Monitor)
- Source IP address
- Target URL
- Source country
- Source reputation (Malicious, Suspicious, Clean, Unknown)

✅ **Threat Evidence**
- The actual attack payload or attack pattern

✅ **Threat Analysis**
- AI-powered threat assessment
- Confidence score (0-100%)
- Attack vector identification
- Specific remediation recommendations

---

## 🚨 Alert Types Available

| Type | Severity | Trigger | Use Case |
|------|----------|---------|----------|
| **SQL_INJECTION** | 🔴 Critical | API Endpoint | Test database security |
| **XSS** | 🟠 High | API Endpoint | Test input validation |
| **BRUTE_FORCE** | 🟠 High | API Endpoint | Test login protection |
| **SUSPICIOUS_IP** | 🟡 Medium | API Endpoint | Test reconnaissance detection |
| **SCANNER_ACTIVITY** | 🟡 Medium | API Endpoint | Test vulnerability scanner detection |
| **OTHER** | 🟠 High | API Endpoint | Test data exfiltration detection |

---

## 💡 Real-World Testing Scenarios

### Scenario 1: Test SQL Injection Protection
```bash
# Step 1: Trigger SQL injection alert
node test-alerts-interactive.js
# Select option 1

# Step 2: See alert on dashboard
# Step 3: Review the remediation steps:
#   - Use parameterized queries
#   - Implement input validation
#   - Deploy WAF
```

### Scenario 2: Simulate Brute Force Attack
```bash
# Trigger brute force alert with 100 attempts
curl -X POST http://127.0.0.1:5000/api/test/brute-force \
  -H "Content-Type: application/json" \
  -d '{"attempts":100}'
```

### Scenario 3: Run Stress Test
```bash
# Run all tests in sequence
node test-alerts-interactive.js
# Select option 'a' for all tests
```

---

## 🔐 Security Tips for Real Threats

The alerts generated include real security recommendations:

### For SQL Injection:
- ✅ Use parameterized queries
- ✅ Use ORM frameworks (Sequelize, TypeORM)
- ✅ Implement input validation
- ✅ Deploy WAF (Web Application Firewall)

### For XSS:
- ✅ Sanitize user input (use DOMPurify)
- ✅ Never use `dangerouslySetInnerHTML`
- ✅ Implement Content Security Policy (CSP)
- ✅ Use templating engines with auto-escaping

### For Brute Force:
- ✅ Implement rate limiting
- ✅ Add account lockout mechanisms
- ✅ Use CAPTCHA verification
- ✅ Enable 2FA/MFA

### For Reconnaissance:
- ✅ Implement IP whitelisting
- ✅ Remove service banners
- ✅ Disable directory listing
- ✅ Use honeypots

---

## 🔄 Workflow

1. **Start the backend server**: Already running at `http://127.0.0.1:5000`
2. **Start the frontend**: Running at `http://localhost:5174`
3. **Login**: Use `browser@test.com` / `loginpassword123`
4. **Generate alerts**: Run `node test-alerts-interactive.js`
5. **See live updates**: Watch alerts appear on dashboard in real-time!
6. **Click alerts**: View detailed threat information including source, evidence, and analysis

---

## 📱 Real-Time Updates

All alerts are:
- 🔴 **Generated instantly** - Alert appears on dashboard within 1 second
- 📡 **Socket.IO enabled** - Live updates via WebSocket
- 💾 **Persisted** - Stored in MongoDB
- 🔍 **Fully analyzed** - Includes threat source and AI analysis
- ✅ **Actionable** - Includes specific remediation steps

---

## ⚙️ Advanced: Custom Payloads

You can customize any alert by modifying the payload:

```bash
# SQL Injection with custom payload
curl -X POST http://127.0.0.1:5000/api/test/sql-injection \
  -H "Content-Type: application/json" \
  -d '{"payload":"admin\x27--DROP DATABASE production;"}'

# Brute force with 200 attempts
curl -X POST http://127.0.0.1:5000/api/test/brute-force \
  -H "Content-Type: application/json" \
  -d '{"attempts":200}'

# Large data exfiltration
curl -X POST http://127.0.0.1:5000/api/test/data-exfiltration \
  -H "Content-Type: application/json" \
  -d '{"file_size_mb":1000}'
```

---

## 📝 Next Steps

1. **Test different alert types** to see how they display
2. **Click alerts** to view detailed threat analysis
3. **Review recommendations** for security improvements
4. **Implement suggested fixes** in your application
5. **Generate more alerts** to practice incident response

---

## 🆘 Troubleshooting

### Alerts not appearing on dashboard?
1. Make sure backend is running: `npm run dev` in `/backend`
2. Make sure frontend is running: `npm run dev` in `/frontend`
3. Check that you're logged in
4. Check browser console for errors

### Getting "Cannot POST /api/test/..." error?
1. Make sure testRoutes.js is registered in server.js
2. Restart the backend server
3. Run: `node test-alerts-interactive.js`

### No recommendations showing?
- Some alerts only show recommendations in the modal
- Click the alert card to see full details

---

## 🎓 Learning Resources

Each alert includes:
- **Attack vector explanation** - What the attack is trying to do
- **Real payloads** - Actual attack code (for educational purposes)
- **Confidence score** - How confident the system is in the detection
- **Specific fixes** - Exact code patterns and practices to implement

Perfect for:
- 🏫 Security training
- 🧪 Penetration testing practice
- 📊 Incident response drills
- 🔍 Security research

---

**Happy testing! 🛡️**
