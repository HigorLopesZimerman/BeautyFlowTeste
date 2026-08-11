import api from "./api";

export const getFuncionarios = async () => {
    const resposta = await api.get("/funcionarios");
    return resposta.data;
};

export const createFuncionario = async (funcionario) => {
    const resposta = await api.post("/funcionarios", funcionario);
    return resposta.data;
};

export const updateFuncionario = async (id, funcionario) => {
    const resposta = await api.put(`/funcionarios/${id}`, funcionario);
    return resposta.data;
};

export const deleteFuncionario = async (id) => {
    const resposta = await api.delete(`/funcionarios/${id}`);
    return resposta.data;
};
