import { useServicos } from "../hooks/useServicos";
import Layout from "../components/Layout";
import SearchBar from "../components/SearchBar";
import ActionButton from "../components/ActionButton";
import EditButton from "../components/EditButton";
import DeleteButton from "../components/DeleteButton";
import Input from "../components/Input";
import Table from "../components/Table";

export default function Servicos() {
    const {
        nome, setNome,
        duracao, setDuracao,
        preco, setPreco,
        servicoEditando,
        pesquisa, setPesquisa,
        servicosFiltrados,
        cadastrarServico,
        excluirServico,
        editarServico
    } = useServicos();


    return (
        <Layout>
            <h1>Serviços</h1>

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
                    + Novo Serviço
                </ActionButton>

                <SearchBar
                    value={pesquisa}
                    onChange={(e) => setPesquisa(e.target.value)}
                    placeholder="Pesquisar serviço..."
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

                <Input
                    type="text"
                    placeholder="Nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                />

                <Input
                    type="text"
                    placeholder="Duração"
                    value={duracao}
                    onChange={(e) => setDuracao(e.target.value)}
                />

                <Input
                    type="text"
                    placeholder="Preço"
                    value={preco}
                    onChange={(e) => setPreco(e.target.value)}
                />


                <button onClick={cadastrarServico}>
                    {servicoEditando ? "Salvar Alterações" : "Cadastrar"}
                </button>

            </div>

            
            

            <Table>

                <thead>
                    <tr>

                        <th>Nome</th>
                        <th>Duração(min)</th>
                        <th>Preço</th>
                        <th>Ações</th>
                    </tr>
                </thead>

                <tbody>

                    {servicosFiltrados.map((servico) => (

                        <tr key={servico.id}>

                            <td>{servico.nome}</td>
                            <td>
                                {servico.duracao} min
                            </td>
                            <td>
                                R$ {servico.preco.toFixed(2)}
                            </td>
                            <td>

                                <EditButton
                                    onClick={() => editarServico(servico)}
                                />

                                <DeleteButton
                                    onClick={() => excluirServico(servico.id)}
                                />

                            </td>

                        </tr>

                    ))}

                </tbody>

            </Table>

        </Layout>
    );
}