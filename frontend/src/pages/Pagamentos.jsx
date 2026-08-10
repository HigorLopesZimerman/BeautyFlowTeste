import Layout from "../components/Layout";
import api from "../services/api";
import { useEffect, useState } from "react";7
import SearchBar from "../components/SearchBar";
import ActionButton from "../components/ActionButton";
import EditButton from "../components/EditButton";
import DeleteButton from "../components/DeleteButton";
import Input from "../components/Input";
import Select from "../components/Select";
import Table from "../components/Table";

export default function Pagamentos() {

    const [pagamentos, setPagamentos] = useState([]);
    const [pesquisa, setPesquisa] = useState("");

    const [agendamentos, setAgendamentos] = useState([]);

    const [agendamentoId, setAgendamentoId] = useState("");

    const [valor, setValor] = useState("");
    const [formaPagamento, setFormaPagamento] = useState("");
    const [status, setStatus] = useState("");
    
    const [dataPagamento, setDataPagamento] = useState("");

    const [pagamentoEditando, setPagamentoEditando] = useState(null);

    useEffect(() => {

        carregarPagamentos();
        carregarAgendamentos();

    }, []);


async function carregarPagamentos() {

    try {

        const resposta = await api.get("/pagamentos");

        setPagamentos(resposta.data);

    } catch (erro) {

        console.error(erro);

    }

}

async function carregarAgendamentos() {

    try {

        const resposta = await api.get("/agendamentos");

        setAgendamentos(resposta.data);

    } catch (erro) {

        console.error(erro);

    }

}


async function cadastrarPagamento() {

    if (
        !agendamentoId ||
        !valor ||
        !formaPagamento ||
        !status ||
        !dataPagamento
    ) {
        alert("Preencha todos os campos.");
        return;
    }

    if (pagamentoEditando) {

        try {

            await api.put(`/pagamentos/${pagamentoEditando}`, {
                agendamento_id: agendamentoId,
                valor,
                forma_pagamento: formaPagamento,
                status,
                data_pagamento: dataPagamento
            });

            setPagamentoEditando(null);

            setAgendamentoId("");
            setValor("");
            setFormaPagamento("");
            setStatus("");
            setDataPagamento("");

            carregarPagamentos();

            return;

        } catch (erro) {

            console.error(erro);

        }

    }

    try {

        await api.post("/pagamentos", {
            agendamento_id: agendamentoId,
            valor,
            forma_pagamento: formaPagamento,
            status,
            data_pagamento: dataPagamento
        });

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

function editarPagamento(pagamento) {

    setPagamentoEditando(pagamento.id);

    setAgendamentoId(pagamento.agendamento_id);
    setValor(pagamento.valor);
    setFormaPagamento(pagamento.forma_pagamento);
    setStatus(pagamento.status);
    setDataPagamento(pagamento.data_pagamento);

}

async function excluirPagamento(id) {

    if (!confirm("Deseja realmente excluir este pagamento?")) {
        return;
    }

    try {

        await api.delete(`/pagamentos/${id}`);

        carregarPagamentos();

    } catch (erro) {

        console.error(erro);

    }

}
   

    const pagamentosFiltrados = pagamentos.filter((pagamento) => {

        const texto = pesquisa.toLowerCase();

        return (

            pagamento.cliente.toLowerCase().includes(texto) ||

            pagamento.servico.toLowerCase().includes(texto) ||

            pagamento.forma_pagamento.toLowerCase().includes(texto) ||

            pagamento.status.toLowerCase().includes(texto)

        );

    });


    async function alterarStatusPagamento(id, novoStatus) {

        try {

            await api.put(`/pagamentos/${id}/status`, {
                status: novoStatus
            });

            carregarPagamentos();

        } catch (erro) {

            console.error(erro);

        }

    }


return (
    <Layout>

        <h1>Pagamentos</h1>

            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "25px",
                }}
            >
                <ActionButton>
                    + Novo Pagamento
                </ActionButton>

                <SearchBar
                    value={pesquisa}
                    onChange={(e) => setPesquisa(e.target.value)}
                    placeholder="Pesquisar pagamento..."
                />
            </div>


        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "12px",
                marginBottom: "35px",
                flexWrap: "wrap",
            }}
        >

            <Select
                value={agendamentoId}
                onChange={(e) => setAgendamentoId(e.target.value)}
            >

                <option value="">
                    Selecione um agendamento
                </option>

                {agendamentos.map((agendamento) => (

                    <option
                        key={agendamento.id}
                        value={agendamento.id}
                    >
                        {agendamento.cliente} - {agendamento.servico}
                    </option>

                ))}

            </Select>

            <Input
                type="number"
                placeholder="Valor"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
            />

            <Input
                type="date"
                value={dataPagamento}
                onChange={(e) => setDataPagamento(e.target.value)}
            />

            <Select
                value={formaPagamento}
                onChange={(e) => setFormaPagamento(e.target.value)}
            >

                <option value="">
                    Forma de pagamento
                </option>

                <option value="Dinheiro">Dinheiro</option>
                <option value="Pix">Pix</option>
                <option value="Cartão de Crédito">Cartão de Crédito</option>
                <option value="Cartão de Débito">Cartão de Débito</option>

            </Select>

            <Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
            >

                <option value="">
                    Status
                </option>

                <option value="Pendente">
                    Pendente
                </option>

                <option value="Pago">
                    Pago
                </option>

                <option value="Cancelado">
                    Cancelado
                </option>

            </Select>

            <button onClick={cadastrarPagamento}>
                {pagamentoEditando ? "Salvar Alterações" : "Cadastrar"}
            </button>

        </div>



        <Table>

            <thead>

                    <tr>

                        <th>ID</th>
                        <th>Cliente</th>
                        <th>Funcionário</th>
                        <th>Serviço</th>
                        <th>Valor</th>
                        <th>Forma</th>
                        <th>Status</th>
                        <th>Data</th>
                        <th>Ações</th>

                    </tr>

                </thead>

                <tbody>

                    {pagamentosFiltrados.map((pagamento) => (

                        <tr key={pagamento.id}>

                            <td>{pagamento.id}</td>
                            <td>{pagamento.cliente}</td>
                            <td>{pagamento.funcionario}</td>
                            <td>{pagamento.servico}</td>
                            <td>R$ {pagamento.valor}</td>
                            <td>{pagamento.forma_pagamento}</td>
                            <td>
                                <select
                                    value={pagamento.status}
                                    onChange={(e) =>
                                        alterarStatusPagamento(
                                            pagamento.id,
                                            e.target.value
                                        )
                                    }
                                >
                                    <option value="Pendente">
                                        🟡 Pendente
                                    </option>

                                    <option value="Pago">
                                        🟢 Pago
                                    </option>

                                    <option value="Cancelado">
                                        🔴 Cancelado
                                    </option>
                                </select>
                            </td>
                            <td>{pagamento.data_pagamento}</td>

                            <td>
                            
                                <EditButton
                                    onClick={() => editarPagamento(pagamento)}
                                />
                            
                                <DeleteButton
                                    onClick={() => excluirPagamento(pagamento.id)}
                                />
                            
                            </td>

                        </tr>

                    ))}

                </tbody>

        </Table>

    </Layout>
);

}