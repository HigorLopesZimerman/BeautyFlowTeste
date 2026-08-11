import { useAgendamentos } from "../hooks/useAgendamentos";
import Layout from "../components/Layout";
import SearchBar from "../components/SearchBar";
import ActionButton from "../components/ActionButton";
import EditButton from "../components/EditButton";
import DeleteButton from "../components/DeleteButton";
import Input from "../components/Input";
import Select from "../components/Select";
import Table from "../components/Table";

export default function Agendamentos() {
    const {
        clientes, funcionarios, servicos,
        clienteId, setClienteId,
        funcionarioId, setFuncionarioId,
        servicoId, setServicoId,
        data, setData,
        hora, setHora,
        agendamentoEditando,
        setFiltroStatus,
        pesquisa, setPesquisa,
        agendamentosFiltrados,
        cadastrarAgendamento,
        excluirAgendamento,
        alterarStatus,
        editarAgendamento
    } = useAgendamentos();


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