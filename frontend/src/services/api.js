// src/services/api.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response, 
    (error) => {
        if (error.response && error.response.status === 401) {
            console.warn("Session expirée ! Redirecting...");
            
            localStorage.clear();
            
            // 1. Utilisez replace() au lieu de href pour éviter le bouton "Back"
            window.location.replace('/login'); 

            // 2. HAD L-STER HOWA L-SIR:
            // Retourner une promesse qui ne se termine jamais ("pending") 
            // pour empêcher React de lever une erreur runtime avant la redirection.
            return new Promise(() => {}); 
        }
        return Promise.reject(error);
    }
);

export default api;