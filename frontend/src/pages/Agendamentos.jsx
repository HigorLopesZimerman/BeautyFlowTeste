import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../services/api";
import SearchBar from "../components/SearchBar";
import ActionButton from "../components/ActionButton";
import EditButton from "../components/EditButton";
import DeleteButton from "../components/DeleteButton";
import Input from "../components/Input";
import Select from "../components/Select";
import Table from "../components/Table";

export default function Agendamentos() {


    const [agendamentos, setAgendamentos] = useState([]);

    const [clientes, setClientes] = useState([]);
    const [funcionarios, setFuncionarios] = useState([]);
    const [servicos, setServicos] = useState([]);

    const [clienteId, setClienteId] = useState("");
    const [funcionarioId, setFuncionarioId] = useState("");
    const [servicoId, setServicoId] = useState("");

    const [data, setData] = useState("");
    const [hora, setHora] = useState("");

    const [status, setStatus] = useState("");

    const [agendamentoEditando, setAgendamentoEditando] = useState(null);

    const [filtroStatus, setFiltroStatus] = useState("Todos");

    const [pesquisa, setPesquisa] = useState("");



    useEffect(() => {
        carregarAgendamentos();
        carregarClientes();
        carregarFuncionarios();
        carregarServicos();
    }, []);


    async function carregarClientes() {


        try {
        const resposta = await api.get("/clientes");

        setClientes(resposta.data);
        } catch (erro) {

            console.error(erro);

        }

    }

    async function carregarFuncionarios() {


        try {
        const resposta = await api.get("/funcionarios");

        setFuncionarios(resposta.data);
        } catch (erro) {

            console.error(erro);

        }

    }

    async function carregarServicos() {


        try {
        const resposta = await api.get("/servicos");

        setServicos(resposta.data);
        } catch (erro) {

            console.error(erro);

        }
        
    }

    async function carregarAgendamentos() {


        try {
        const resposta = await api.get("/agendamentos");

        console.log(resposta.data);

        setAgendamentos(resposta.data);
        console.log(resposta.data.map(a => a.status));
        } catch (erro) {

            console.error(erro);

        }

    }




    async function cadastrarAgendamento() {
        
        if (!clienteId || !funcionarioId || !servicoId || !data || !hora) {
            alert("Preencha todos os campos.");
            return;
        }

        if (agendamentoEditando) {

            try {

                await api.put(`/agendamentos/${agendamentoEditando}`, {
                    cliente_id: clienteId,
                    funcionario_id: funcionarioId,
                    servico_id: servicoId,
                    data,
                    hora,
                    status

                });

                setAgendamentoEditando(null);
                setClienteId("");
                setFuncionarioId("");
                setServicoId("");
                setData("");
                setHora("");
                
                carregarAgendamentos();

                return;

            } catch (erro) {
                console.error(erro);
                return;
            }

    }

    try {

        await api.post("/agendamentos", {
            cliente_id: clienteId,
            funcionario_id: funcionarioId,
            servico_id: servicoId,
            data,
            hora
        });

        setClienteId("");
        setFuncionarioId("");
        setServicoId("");
        setData("");
        setHora("");

        carregarAgendamentos();

    } catch (erro) {
        console.error(erro);
    }

    }


    async function excluirAgendamento(id) {

        const confirmar = window.confirm(
            "Deseja realmente excluir este agendamento?"
        );

        if (!confirmar) {
            return;
        }

        try {

            await api.delete(`/agendamentos/${id}`);

            carregarAgendamentos();

        } catch (erro) {
            console.error(erro);
        }

    }

    async function alterarStatus(id, novoStatus) {

        try {

            await api.put(`/agendamentos/${id}/status`, {
                status: novoStatus
            });

            carregarAgendamentos();

        } catch (erro) {

            console.error(erro);

        }

    }


    function editarAgendamento(agendamento) {

        setAgendamentoEditando(agendamento.id);

        setClienteId(agendamento.cliente_id);
        setFuncionarioId(agendamento.funcionario_id);
        setServicoId(agendamento.servico_id);

        setData(agendamento.data);
        setHora(agendamento.hora);

        setStatus(agendamento.status);

    }

   const agendamentosFiltrados = agendamentos.filter((agendamento) => {

        const texto = pesquisa.toLowerCase();

        const correspondePesquisa =

            agendamento.cliente.toLowerCase().includes(texto) ||

            agendamento.funcionario.toLowerCase().includes(texto) ||

            agendamento.servico.toLowerCase().includes(texto);

        const correspondeStatus =

            filtroStatus === "Todos" ||

            agendamento.status === filtroStatus;

        return correspondePesquisa && correspondeStatus;

    });


    return (
        <Layout>
            <h1>Agendamentos</h1>

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
                        + Novo Agendamento
                    </ActionButton>

                    <SearchBar
                        value={pesquisa}
                        onChange={(e) => setPesquisa(e.target.value)}
                        placeholder="Pesquisar agendamento..."
                    />

                    <div
                        style={{
                            display: "flex",
                            gap: "10px",
                            marginTop: "5px",
                            flexWrap: "wrap",
                            justifyContent: "center",
                        }}
                    >
                        <button onClick={() => setFiltroStatus("Todos")}>
                            Todos
                        </button>

                        <button onClick={() => setFiltroStatus("agendado")}>
                            Agendados
                        </button>

                        <button onClick={() => setFiltroStatus("concluido")}>
                            Concluídos
                        </button>

                        <button onClick={() => setFiltroStatus("cancelado")}>
                            Cancelados
                        </button>
                    </div>
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
                        value={clienteId}
                        onChange={(e) => setClienteId(e.target.value)}
                    >
                        <option value="">
                            Selecione um cliente
                        </option>

                        {clientes.map((cliente) => (
                            <option
                                key={cliente.id}
                                value={cliente.id}
                            >
                                {cliente.nome}
                            </option>
                        ))}
                    </Select>

                    <Select
                        value={funcionarioId}
                        onChange={(e) => setFuncionarioId(e.target.value)}
                    >
                        <option value="">
                            Selecione um funcionário
                        </option>

                        {funcionarios.map((funcionario) => (
                            <option
                                key={funcionario.id}
                                value={funcionario.id}
                            >
                                {funcionario.nome}
                            </option>
                        ))}
                    </Select>

                    <Select
                        value={servicoId}
                        onChange={(e) => setServicoId(e.target.value)}
                    >
                        <option value="">
                            Selecione um serviço
                        </option>

                        {servicos.map((servico) => (
                            <option
                                key={servico.id}
                                value={servico.id}
                            >
                                {servico.nome}
                            </option>
                        ))}
                    </Select>

                    <Input
                        type="date"
                        value={data}
                        onChange={(e) => setData(e.target.value)}
                        style={{
                            padding: "8px",
                        }}
                    />

                    <Input
                        type="time"
                        value={hora}
                        onChange={(e) => setHora(e.target.value)}
                        style={{
                            padding: "8px",
                        }}
                    />

                    <button onClick={cadastrarAgendamento}>
                        {agendamentoEditando
                            ? "Salvar Alterações"
                            : "Cadastrar"}
                    </button>
                </div>
            
                <Table>

                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Cliente</th>
                            <th>Funcionário</th>
                            <th>Serviço</th>
                            <th>Data</th>
                            <th>Hora</th>
                            <th>Status</th>
                            <th>Ações</th>
                        </tr>
                    </thead>

                    <tbody>

                        {agendamentosFiltrados.map((agendamento) => (

                            <tr key={agendamento.id}>

                                <td>{agendamento.id}</td>
                                <td>{agendamento.cliente}</td>
                                <td>{agendamento.funcionario}</td>
                                <td>{agendamento.servico}</td>
                                <td>{agendamento.data}</td>
                                <td>{agendamento.hora}</td>
                                <td>
                                    <select
                                        value={agendamento.status}
                                        onChange={(e) =>
                                            alterarStatus(agendamento.id, e.target.value)
                                        }
                                    >

                                        <option value="agendado">
                                            🟡 Agendado
                                        </option>

                                        <option value="concluido">
                                            🟢 Concluído
                                        </option>

                                        <option value="cancelado">
                                            🔴 Cancelado
                                        </option>

                                    </select>
                                </td>

                                <td>

                                    <EditButton
                                        onClick={() => editarAgendamento(agendamento)}
                                    />

                                    <DeleteButton
                                        onClick={() => excluirAgendamento(agendamento.id)}
                                    />

                                </td>

                            </tr>

                            ))}

                    </tbody>

                    </Table>

        </Layout>
    );
}