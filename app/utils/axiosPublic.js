// utils/axiosInstance.js
import axios from 'axios';

const axiosPublic = axios.create({
  // baseURL: 'https://realdocs-backend.onrender.com',
  baseURL: 'http://localhost:5000',
});

export default axiosPublic;
