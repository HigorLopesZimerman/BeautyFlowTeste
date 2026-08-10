import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../services/api";
import SearchBar from "../components/SearchBar";
import ActionButton from "../components/ActionButton";
import EditButton from "../components/EditButton";
import DeleteButton from "../components/DeleteButton";
import Input from "../components/Input";
import Table from "../components/Table";

export default function Funcionarios() {

    const [funcionarios, setFuncionarios] = useState([]);
    const [pesquisa, setPesquisa] = useState("");
    const [nome, setNome] = useState("");
    const [funcao, setFuncao] = useState("");
    const [telefone, setTelefone] = useState("");
    const [email, setEmail] = useState("");
    const [funcionarioEditando, setFuncionarioEditando] = useState(null);

    useEffect(() => {
        carregarFuncionarios();
    }, []);

    async function carregarFuncionarios() {
        try {
            const resposta = await api.get("/funcionarios");
            setFuncionarios(resposta.data);
        } catch (erro) {
            console.error(erro);
        }
    }

    async function cadastrarFuncionario() {

        if (!nome || !funcao || !telefone || !email) {
            alert("Preencha todos os campos.");
            return;
        }

        if (funcionarioEditando) {

            try {

                await api.put(`/funcionarios/${funcionarioEditando}`, {
                    nome,
                    funcao,
                    telefone,
                    email
                });

                setFuncionarioEditando(null);
                setNome("");
                setFuncao("");
                setTelefone("");
                setEmail("");

                carregarFuncionarios();

                return;

            } catch (erro) {
                console.error(erro);
                return;
            }
        }

        try {

            await api.post("/funcionarios", {
                nome,
                funcao,
                telefone,
                email
            });

            setNome("");
            setFuncao("");
            setTelefone("");
            setEmail("");

            carregarFuncionarios();

        } catch (erro) {
            console.error(erro);
        }
    }

    async function excluirFuncionario(id) {

        const confirmar = window.confirm(
            "Deseja realmente excluir este funcionário?"
        );

        if (!confirmar) {
            return;
        }

        try {

            await api.delete(`/funcionarios/${id}`);

            carregarFuncionarios();

        } catch (erro) {
            console.error(erro);
        }
    }

    function editarFuncionario(funcionario) {

        setFuncionarioEditando(funcionario.id);

        setNome(funcionario.nome);
        setFuncao(funcionario.funcao);
        setTelefone(funcionario.telefone);
        setEmail(funcionario.email);
    
    }

    const funcionariosFiltrados = funcionarios.filter((funcionario) =>

        funcionario.nome
            .toLowerCase()
            .includes(pesquisa.toLowerCase())

    );


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
                        <th>ID</th>
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
                            <td>{funcionario.id}</td>
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