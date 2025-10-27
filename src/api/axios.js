import axios from 'axios';

const API = axios.create({
  baseURL:'http://148.135.138.69:6868/api',
  withCredentials: true
});

export default API;
