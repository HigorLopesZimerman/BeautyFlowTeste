import api from "./api";

export const getRelatorios = async (inicio = "", fim = "") => {
    const params = {};
    if (inicio && fim) {
        params.inicio = inicio;
        params.fim = fim;
    }
    const resposta = await api.get("/relatorios", { params });
    return resposta.data;
};
