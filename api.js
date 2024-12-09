import axios from 'axios';

const API = axios.create({
    baseURL: 'http://192.168.1.129:5000/api/tasks', // Android emulator uses 10.0.2.2 for localhost
});

export default API;
