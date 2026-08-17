import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000`;

const api = axios.create({
    baseURL: apiUrl,
    headers: {
        "ngrok-skip-browser-warning": "true"
    }
});

export default api;
