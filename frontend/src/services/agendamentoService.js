import api from "./api";

export const getAgendamentos = async () => {
    const resposta = await api.get("/agendamentos");
    return resposta.data;
};

export const createAgendamento = async (agendamento) => {
    const resposta = await api.post("/agendamentos", agendamento);
    return resposta.data;
};

export const updateAgendamento = async (id, agendamento) => {
    const resposta = await api.put(`/agendamentos/${id}`, agendamento);
    return resposta.data;
};

export const deleteAgendamento = async (id) => {
    const resposta = await api.delete(`/agendamentos/${id}`);
    return resposta.data;
};

export const updateAgendamentoStatus = async (id, status) => {
    const resposta = await api.put(`/agendamentos/${id}/status`, { status });
    return resposta.data;
};
