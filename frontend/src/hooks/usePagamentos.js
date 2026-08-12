import { useState, useEffect } from "react";
import { getPagamentos, createPagamento, updatePagamento, deletePagamento, updatePagamentoStatus } from "../services/pagamentoService";
import { getAgendamentos } from "../services/agendamentoService";

export function usePagamentos() {
    const [pagamentos, setPagamentos] = useState([]);
    const [agendamentos, setAgendamentos] = useState([]);
    const [pesquisa, setPesquisa] = useState("");

    const [agendamentoId, setAgendamentoId] = useState("");
    const [valor, setValor] = useState("");
    const [formaPagamento, setFormaPagamento] = useState("");
    const [status, setStatus] = useState("");
    const [dataPagamento, setDataPagamento] = useState("");

    const [pagamentoEditando, setPagamentoEditando] = useState(null);

    useEffect(() => {
        carregarPagamentos();
        carregarAgendamentosData();
    }, []);

    async function carregarPagamentos() {
        try {
            const data = await getPagamentos();
            setPagamentos(data);
        } catch (erro) {
            console.error(erro);
        }
    }

    async function carregarAgendamentosData() {
        try {
            const data = await getAgendamentos();
            setAgendamentos(data);
        } catch (erro) {
            console.error(erro);
        }
    }

    async function cadastrarPagamento() {
        if (!agendamentoId || !valor || !formaPagamento || !status || !dataPagamento) {
            alert("Preencha todos os campos.");
            return;
        }

        try {
            if (pagamentoEditando) {
                await updatePagamento(pagamentoEditando, {
                    agendamento_id: agendamentoId,
                    valor,
                    forma_pagamento: formaPagamento,
                    status,
                    data_pagamento: dataPagamento
                });
                setPagamentoEditando(null);
            } else {
                await createPagamento({
                    agendamento_id: agendamentoId,
                    valor,
                    forma_pagamento: formaPagamento,
                    status,
                    data_pagamento: dataPagamento
                });
            }

            setAgendamentoId("");
            setValor("");
            setFormaPagamento("");
            setStatus("");
            setDataPagamento("");

            carregarPagamentos();
        } catch (erro) {
            console.error(erro);
        }
    }

    async function excluirPagamento(id) {
        if (!confirm("Deseja realmente excluir este pagamento?")) return;

        try {
            await deletePagamento(id);
            carregarPagamentos();
        } catch (erro) {
            console.error(erro);
        }
    }

    async function alterarStatusPagamento(id, novoStatus) {
        try {
            await updatePagamentoStatus(id, novoStatus);
            carregarPagamentos();
        } catch (erro) {
            console.error(erro);
        }
    }

    function editarPagamento(pagamento) {
        if (!pagamento) {
            setPagamentoEditando(null);
            return;
        }
        setPagamentoEditando(pagamento.id);
        setAgendamentoId(pagamento.agendamento_id);
        setValor(pagamento.valor);
        setFormaPagamento(pagamento.forma_pagamento);
        setStatus(pagamento.status);
        setDataPagamento(pagamento.data_pagamento);
    }

    const pagamentosFiltrados = pagamentos.filter((pagamento) => {
        const texto = pesquisa.toLowerCase();
        return (
            (pagamento.cliente && pagamento.cliente.toLowerCase().includes(texto)) ||
            (pagamento.servico && pagamento.servico.toLowerCase().includes(texto)) ||
            (pagamento.forma_pagamento && pagamento.forma_pagamento.toLowerCase().includes(texto)) ||
            (pagamento.status && pagamento.status.toLowerCase().includes(texto))
        );
    });

    return {
        agendamentos,
        agendamentoId, setAgendamentoId,
        valor, setValor,
        formaPagamento, setFormaPagamento,
        status, setStatus,
        dataPagamento, setDataPagamento,
        pagamentoEditando,
        pesquisa, setPesquisa,
        pagamentosFiltrados,
        cadastrarPagamento,
        excluirPagamento,
        alterarStatusPagamento,
        editarPagamento
    };
}
