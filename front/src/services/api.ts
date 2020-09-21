import axios from 'axios';

// endereço do backend sem a parte dos recursos
const api = axios.create({
    baseURL: 'http://localhost:3333',
});

export default api;