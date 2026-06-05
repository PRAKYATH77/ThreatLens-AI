import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const useSocket = () => {
  const [alerts, setAlerts] = useState([]);
  
  // Get URL from env
  const apiBaseUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

  useEffect(() => {
    const socketInstance = io(apiBaseUrl, {
      withCredentials: true,
      transports: ['websocket', 'polling']
    });

    socketInstance.on('connect', () => {
      console.log('🛡️ WebSocket connected successfully!');
    });

    socketInstance.on('newAlert', (alertData) => {
      console.log('🚨 New Alert:', alertData);
      setAlerts((prevAlerts) => [alertData, ...prevAlerts]);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [apiBaseUrl]);

  return { alerts };
};

export default useSocket;