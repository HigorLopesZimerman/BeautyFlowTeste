import { useFuncionarios } from "../hooks/useFuncionarios";
import Layout from "../components/Layout";
import SearchBar from "../components/SearchBar";
import ActionButton from "../components/ActionButton";
import EditButton from "../components/EditButton";
import DeleteButton from "../components/DeleteButton";
import Input from "../components/Input";
import Table from "../components/Table";

export default function Funcionarios() {
    const {
        nome, setNome,
        funcao, setFuncao,
        telefone, setTelefone,
        email, setEmail,
        funcionarioEditando,
        pesquisa, setPesquisa,
        funcionariosFiltrados,
        cadastrarFuncionario,
        excluirFuncionario,
        editarFuncionario
    } = useFuncionarios();


    return (
        <Layout>

            <h1>Funcionários</h1>

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
                    + Novo Funcionário
                </ActionButton>

                <SearchBar
                    value={pesquisa}
                    onChange={(e) => setPesquisa(e.target.value)}
                    placeholder="Pesquisar funcionário..."
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
                    placeholder="Função"
                    value={funcao}
                    onChange={(e) => setFuncao(e.target.value)}
                />

                <Input
                    type="text"
                    placeholder="Telefone"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                />

                <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <button onClick={cadastrarFuncionario}>
                    {funcionarioEditando ? "Salvar Alterações" : "Cadastrar"}
                </button>

            </div>

            

            <Table>

                <thead>
                    <tr>

                        <th>Nome</th>
                        <th>Função</th>
                        <th>Telefone</th>
                        <th>Email</th>
                        <th>Ações</th>
                    </tr>
                </thead>

                <tbody>

                    {funcionariosFiltrados.map((funcionario) => (

                        <tr key={funcionario.id}>

                            <td>{funcionario.nome}</td>
                            <td>{funcionario.funcao}</td>
                            <td>{funcionario.telefone}</td>
                            <td>{funcionario.email}</td>

                            <td>

                                <EditButton
                                    onClick={() => editarFuncionario(funcionario)}
                                />      
                                        
                                <DeleteButton
                                    onClick={() => excluirFuncionario(funcionario.id)}
                                />

                            </td>

                        </tr>

                    ))}

                </tbody>

            </Table>

        </Layout>
    );
}