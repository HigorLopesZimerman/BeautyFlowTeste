import api from './api';

export const login = async (email, senha) => {
    try {
        const response = await api.post('/auth/login', { email, senha });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.erro || "Erro ao fazer login");
    }
};

export const register = async (nome, email, senha) => {
    try {
        const response = await api.post('/auth/register', { nome, email, senha });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.erro || "Erro ao cadastrar conta");
    }
};

export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
};

export const isAuthenticated = () => {
    return !!localStorage.getItem("token");
};
