import axios from 'axios';

const instance = axios.create({
    // baseURL: 'https://api.boquetemarket.com'
    baseURL: 'http://localhost:3033'
});

export default instance;