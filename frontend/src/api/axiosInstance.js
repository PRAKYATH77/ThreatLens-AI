import axios from "axios";

const axiosInstance = axios.create({
  // Use the environment variable, fallback to localhost if missing
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:5000/api",
  withCredentials: true, // Required for the JWT Cookie
  headers: {
    "Content-Type": "application/json",
  },
});

// If a token exists in localStorage (set during login), attach it to default headers
try {
  const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
  if (token) {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
} catch (e) {
  // ignore (e.g., server-side rendering or no localStorage)
}

// Add request interceptor to ensure token is always included
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle authentication errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // If we get a 401 (Unauthorized), clear the token and redirect to login
    if (error.response?.status === 401) {
      try {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('token');
        localStorage.removeItem('auth-storage');
        delete axiosInstance.defaults.headers.common['Authorization'];
        // Optional: redirect to login
        if (window.location.pathname !== '/') {
          window.location.href = '/';
        }
      } catch (e) {
        console.error('Error clearing auth:', e);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;