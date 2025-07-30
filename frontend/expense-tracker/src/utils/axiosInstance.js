import axios from 'axios';
import {BASE_URL} from './apiPath';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000, // 10 seconds timeout
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
    });

    // Request Interceptor
    axiosInstance.interceptors.request.use(
        (config) => {
            const accessToken = localStorage.getItem('token');
            if (accessToken) {
                config.headers.Authorization = `Bearer ${accessToken}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    // Response Interceptor
    axiosInstance.interceptors.response.use(
        (response) => {
            return response;
        },
        (error) => {
            if (error.response ) {
                if (error.response.status === 401) {
                    // Handle unauthorized access
                    console.error('Unauthorized access - redirecting to login');
                    localStorage.removeItem('token');
                    window.location.href = '/login'; // Redirect to login page
                }
                else if (error.response.status === 500) {
                    console.error('Server error - please try again later');
                } else if (error.code === 'ECONNABORTED') {
                    console.error('Request timed out - please try again later');
                }
            }
            return Promise.reject(error);
        }
    );

    export default axiosInstance;


