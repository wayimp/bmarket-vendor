import Router from 'next/router'
import cookie from 'js-cookie'
import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:3033'
});

/*
instance.interceptors.request.use(
  config => {
    const token = cookie.get('token')
    if (token) {
      config.headers.Authorization = token
    }
    return config
  },
  error => {
    console.error(message)
    Router.push('/')
  }
)
*/

export default instance;