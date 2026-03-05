import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/tasks/';

// Jib l-token mn l-localStorage kima derti f l-projects
const getAuthHeaders = () => {
    const token = localStorage.getItem('access_token');
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

const taskService = {
    // Jib l-tasks dyal projet mu3ayyan
    getTasksByProject: (projectId) => {
        return axios.get(`${API_URL}?project=${projectId}`, getAuthHeaders());
    },

    // Creeyi task jdida
    createTask: (taskData) => {
        return axios.post(API_URL, taskData, getAuthHeaders());
    },

    // Modifier task (status, priority...)
    updateTask: (id, taskData) => {
        return axios.put(`${API_URL}${id}/`, taskData, getAuthHeaders());
    },

    // Mseh task
    deleteTask: (id) => {
        return axios.delete(`${API_URL}${id}/`, getAuthHeaders());
    }
};

export default taskService;















































































