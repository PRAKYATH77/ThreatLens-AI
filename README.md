# ThreatLens-AI

**Enterprise-Grade Real-Time Cybersecurity Threat Detection & Response Platform**

ThreatLens-AI is a comprehensive security monitoring and threat detection platform that combines real-time threat detection, AI-powered analysis, and intelligent alert management. Built with a modern tech stack, it provides enterprise security operations centers (SOCs) with actionable threat intelligence and automated response recommendations.

## Key Features

- **Real-Time Threat Detection**: Scans incoming API requests for SQL Injection, XSS, brute force attempts, suspicious IP reconnaissance, network scanner activity, and data exfiltration.
- **AI-Powered Security Analysis**: Automated incident analysis with confidence scoring, attack vector identification, and natural language remediation recommendations.
- **Threat Source Intelligence**: Tracks source IP geolocation, attack vectors, target URLs, source reputation, and detection sources.
- **Interactive Dashboard**: Real-time alert feed, severity filtering, advanced search, and data visualizations.
- **User Authentication & Management**: Role-based access control with secure JWT authentication.
- **Data Export & Compliance**: CSV and JSON export functionality with comprehensive audit logging.

## Tech Stack

- **Frontend**: React 18.2, Vite, TailwindCSS v3, Socket.IO Client, Zustand, Chart.js
- **Backend**: Node.js, Express.js, MongoDB, Socket.IO, JWT, OpenRouter API

## Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- MongoDB (local or Atlas cloud)

### Getting Started

1. **Clone the repository and install dependencies**
   ```bash
   git clone <repo-url>
   cd ThreatLens-AI
   
   cd frontend && npm install
   cd ../backend && npm install
   ```

2. **Configure Environment Variables**
   Create a `.env` file in the `backend/` directory:
   ```env
   MONGO_URI=mongodb://localhost:27017/threatlens-ai
   JWT_SECRET=your-super-secret-jwt-key
   GEMINI_API_KEY=your-gemini-api-key
   OPENROUTER_API_KEY=your-openrouter-api-key
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5174
   ```

3. **Start the Application**
   - Start the backend server:
     ```bash
     cd backend
     npm start
     ```
   - Start the frontend development server:
     ```bash
     cd frontend
     npm run dev
     ```

4. **Access the Dashboard**
   Navigate to `http://localhost:5174` and log in with the test credentials:
   - **Email**: browser@test.com
   - **Password**: loginpassword123

## Documentation

For more detailed information, please refer to the specific documentation files:
- [API Reference](./docs/API_REFERENCE.md)
- [Alert Generation Guide](./ALERT_GENERATOR_GUIDE.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)

## License

This project is licensed under the MIT License.
