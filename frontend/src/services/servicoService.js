import api from "./api";

export const getServicos = async () => {
    const resposta = await api.get("/servicos");
    return resposta.data;
};

export const createServico = async (servico) => {
    const resposta = await api.post("/servicos", servico);
    return resposta.data;
};

export const updateServico = async (id, servico) => {
    const resposta = await api.put(`/servicos/${id}`, servico);
    return resposta.data;
};

export const deleteServico = async (id) => {
    const resposta = await api.delete(`/servicos/${id}`);
    return resposta.data;
};
