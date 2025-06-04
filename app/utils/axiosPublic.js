// utils/axiosInstance.js
import axios from 'axios';

const axiosPublic = axios.create({
  baseURL: 'https://realdocs-backend.onrender.com',
});

export default axiosPublic;
