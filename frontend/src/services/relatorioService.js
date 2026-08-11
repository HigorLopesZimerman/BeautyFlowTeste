import api from "./api";

export const getRelatorios = async () => {
    const resposta = await api.get("/relatorios");
    return resposta.data;
};

export const getFaturamentoPeriodo = async (inicio, fim) => {
    const resposta = await api.get("/relatorios/faturamento", {
        params: { inicio, fim }
    });
    return resposta.data.faturamento;
};
