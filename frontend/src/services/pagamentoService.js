import api from "./api";

export const getPagamentos = async () => {
    const resposta = await api.get("/pagamentos");
    return resposta.data;
};

export const createPagamento = async (pagamento) => {
    const resposta = await api.post("/pagamentos", pagamento);
    return resposta.data;
};

export const updatePagamento = async (id, pagamento) => {
    const resposta = await api.put(`/pagamentos/${id}`, pagamento);
    return resposta.data;
};

export const deletePagamento = async (id) => {
    const resposta = await api.delete(`/pagamentos/${id}`);
    return resposta.data;
};

export const updatePagamentoStatus = async (id, status) => {
    const resposta = await api.put(`/pagamentos/${id}/status`, { status });
    return resposta.data;
};
