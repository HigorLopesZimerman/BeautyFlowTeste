import api from "./api";

export const getClientes = async () => {
    const resposta = await api.get("/clientes");
    return resposta.data;
};

export const createCliente = async (cliente) => {
    const resposta = await api.post("/clientes", cliente);
    return resposta.data;
};

export const updateCliente = async (id, cliente) => {
    const resposta = await api.put(`/clientes/${id}`, cliente);
    return resposta.data;
};

export const deleteCliente = async (id) => {
    const resposta = await api.delete(`/clientes/${id}`);
    return resposta.data;
};
