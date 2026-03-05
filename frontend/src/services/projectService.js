import axios from 'axios';
import api from './api';

const API_URL = 'http://127.0.0.1:8000/api/projects/';

// Fonction bach n-jibu l-Header fih l-Token d l-Login
const getAuthHeaders = () => {
    const token = localStorage.getItem('access_token'); // Tأkked mn s-miya li derti f l-Login
    return { headers: { Authorization: `Bearer ${token}` } };
};

export const projectService = {
    // Consulter
    //getProjects: () => axios.get(API_URL, getAuthHeaders()),
    

    getProjects: () => api.get('projects/'), // Hna l-token kiy-tzad bo7do w expiration m-checkya
    // Créer (Nom + Description)
    createProject: (data) => axios.post(API_URL, data, getAuthHeaders()),
    
    // Modifier
    updateProject: (id, data) => axios.put(`${API_URL}${id}/`, data, getAuthHeaders()),
    
    // Supprimer
    deleteProject: (id) => axios.delete(`${API_URL}${id}/`, getAuthHeaders()),
};