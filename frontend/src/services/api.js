import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL || "https://excretory-agonize-plop.ngrok-free.dev";

const api = axios.create({
    baseURL: "https://excretory-agonize-plop.ngrok-free.dev",
    headers: {
        "ngrok-skip-browser-warning": "true"
    }
});

export default api;
