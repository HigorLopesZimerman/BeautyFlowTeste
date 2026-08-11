import api from "./api";

export const getDashboardData = async () => {
    const resposta = await api.get("/dashboard");
    return resposta.data;
};
