import { useState, useEffect } from "react";
import { getAgendamentos, createAgendamento, updateAgendamento, deleteAgendamento, updateAgendamentoStatus } from "../services/agendamentoService";
import { getClientes } from "../services/clienteService";
import { getFuncionarios } from "../services/funcionarioService";
import { getServicos } from "../services/servicoService";

export function useAgendamentos() {
    const [agendamentos, setAgendamentos] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [funcionarios, setFuncionarios] = useState([]);
    const [servicos, setServicos] = useState([]);

    const [clienteId, setClienteId] = useState("");
    const [funcionarioId, setFuncionarioId] = useState("");
    const [servicoId, setServicoId] = useState("");
    const [data, setData] = useState("");
    const [hora, setHora] = useState("");
    const [horaFim, setHoraFim] = useState("");
    const [status, setStatus] = useState("agendado");

    const [agendamentoEditando, setAgendamentoEditando] = useState(null);
    const [filtroStatus, setFiltroStatus] = useState("Todos");
    const [pesquisa, setPesquisa] = useState("");

    useEffect(() => {
        carregarAgendamentos();
        carregarListas();
    }, []);

    async function carregarListas() {
        try {
            const [cls, funcs, servs] = await Promise.all([
                getClientes(),
                getFuncionarios(),
                getServicos()
            ]);
            setClientes(cls);
            setFuncionarios(funcs);
            setServicos(servs);
        } catch (erro) {
            console.error("Erro ao carregar listas:", erro);
        }
    }

    async function carregarAgendamentos() {
        try {
            const data = await getAgendamentos();
            setAgendamentos(data);
        } catch (erro) {
            console.error(erro);
        }
    }

    async function cadastrarAgendamento() {
        if (!clienteId || !funcionarioId || !servicoId || !data || !hora) {
            alert("Preencha todos os campos.");
            return;
        }

        try {
            if (agendamentoEditando) {
                await updateAgendamento(agendamentoEditando, {
                    cliente_id: clienteId,
                    funcionario_id: funcionarioId,
                    servico_id: servicoId,
                    data,
                    hora,
                    hora_fim: horaFim,
                    status
                });
                setAgendamentoEditando(null);
            } else {
                await createAgendamento({
                    cliente_id: clienteId,
                    funcionario_id: funcionarioId,
                    servico_id: servicoId,
                    data,
                    hora,
                    hora_fim: horaFim,
                    status: status || "agendado"
                });
            }

            setClienteId("");
            setFuncionarioId("");
            setServicoId("");
            setData("");
            setHora("");
            setHoraFim("");
            setStatus("agendado");
            carregarAgendamentos();
        } catch (erro) {
            console.error(erro);
        }
    }

    async function excluirAgendamento(id) {
        const confirmar = window.confirm("Deseja realmente excluir este agendamento?");
        if (!confirmar) return;

        try {
            await deleteAgendamento(id);
            carregarAgendamentos();
        } catch (erro) {
            console.error(erro);
        }
    }

    async function alterarStatus(id, novoStatus) {
        try {
            await updateAgendamentoStatus(id, novoStatus);
            carregarAgendamentos();
        } catch (erro) {
            console.error(erro);
        }
    }

    function editarAgendamento(agendamento) {
        if (!agendamento) {
            setAgendamentoEditando(null);
            return;
        }
        setAgendamentoEditando(agendamento.id);
        setClienteId(agendamento.cliente_id);
        setFuncionarioId(agendamento.funcionario_id);
        setServicoId(agendamento.servico_id);
        setData(agendamento.data);
        setHora(agendamento.hora || "");
        setHoraFim(agendamento.hora_fim || "");
        setStatus(agendamento.status || "agendado");
    }

    const agendamentosFiltrados = agendamentos.filter((agendamento) => {
        const texto = pesquisa.toLowerCase();
        const correspondePesquisa =
            (agendamento.cliente && agendamento.cliente.toLowerCase().includes(texto)) ||
            (agendamento.funcionario && agendamento.funcionario.toLowerCase().includes(texto)) ||
            (agendamento.servico && agendamento.servico.toLowerCase().includes(texto));

        const correspondeStatus = filtroStatus === "Todos" || agendamento.status === filtroStatus;

        return correspondePesquisa && correspondeStatus;
    });

    return {
        clientes, funcionarios, servicos,
        clienteId, setClienteId,
        funcionarioId, setFuncionarioId,
        servicoId, setServicoId,
        data, setData,
        hora, setHora,
        horaFim, setHoraFim,
        status, setStatus,
        agendamentoEditando,
        filtroStatus, setFiltroStatus,
        pesquisa, setPesquisa,
        agendamentosFiltrados,
        cadastrarAgendamento,
        excluirAgendamento,
        alterarStatus,
        editarAgendamento
    };
}
