import axios from 'axios';
import { msalInstance, loginRequest } from './auth';

const api = axios.create({
    baseURL: 'http://localhost:3001', // Replace with backend server URL
});

api.interceptors.request.use(async (config) => {
    const account = msalInstance.getActiveAccount();
    console.log('Request interceptor', account);
    console.log('Request interceptor', msalInstance.getAllAccounts());
    if (account) {
        const token = await msalInstance.acquireTokenSilent({
            scopes: loginRequest.scopes,
            account: account,
        });
        config.headers['Authorization'] = `Bearer ${token.accessToken}`;
        console.log('token', token.accessToken);
        console.log('auth', config.headers['Authorization']);
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;