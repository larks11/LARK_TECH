import axios from 'axios';

const axiosInstance = axios.create({
  baseURL:
    process.env.NODE_ENV === 'production'
      ? 'https://lark-tech.onrender.com' // ✅ your deployed backend base URL
      : 'http://localhost:5000',
  withCredentials: true, // ✅ allow cookies (JWT)
});

export default axiosInstance;
