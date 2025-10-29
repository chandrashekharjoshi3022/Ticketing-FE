import axios from 'axios';

const API = axios.create({
  // baseURL:'http://148.135.138.69:6963/api',
  baseURL:'http://localhost:5000/api',
  withCredentials: true
});

export default API;


