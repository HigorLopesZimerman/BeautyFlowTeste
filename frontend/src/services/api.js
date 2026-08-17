import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL || "https://excretory-agonize-plop.ngrok-free.dev";

const api = axios.create({
    baseURL: apiUrl,
    headers: {
        "ngrok-skip-browser-warning": "true"
    }
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
