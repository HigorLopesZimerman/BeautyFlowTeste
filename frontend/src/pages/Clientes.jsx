import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../services/api";
import SearchBar from "../components/SearchBar";
import ActionButton from "../components/ActionButton";
import EditButton from "../components/EditButton";
import DeleteButton from "../components/DeleteButton";
import Input from "../components/Input";
import Table from "../components/Table";

export default function Clientes() {

    const [clientes, setClientes] = useState([]);
    const [nome, setNome] = useState("");
    const [telefone, setTelefone] = useState("");
    const [email, setEmail] = useState("");
    const [clienteEditando, setClienteEditando] = useState(null);

    const [pesquisa, setPesquisa] = useState("");

    useEffect(() => {
        carregarClientes();
    }, []);

    async function carregarClientes() {
        try {
            const resposta = await api.get("/clientes");
            setClientes(resposta.data);
        } catch (erro) {
            console.error(erro);
        }
    }

    async function cadastrarCliente() {

        if (!nome || !telefone || !email) {
            alert("Preencha todos os campos.");
            return;
        }

        if (clienteEditando) {

            try {

                await api.put(`/clientes/${clienteEditando}`, {
                    nome,
                    telefone,
                    email
                });

                setClienteEditando(null);
                setNome("");
                setTelefone("");
                setEmail("");

                carregarClientes();

                return;

            } catch (erro) {
                console.error(erro);
                return;
            }
        }

        try {

            await api.post("/clientes", {
                nome,
                telefone,
                email
            });

            setNome("");
            setTelefone("");
            setEmail("");

            carregarClientes();

        } catch (erro) {
            console.error(erro);
        }
    }

    async function excluirCliente(id) {

        const confirmar = window.confirm(
            "Deseja realmente excluir este cliente?"
        );

        if (!confirmar) {
            return;
        }

        try {

            await api.delete(`/clientes/${id}`);

            carregarClientes();

        } catch (erro) {
            console.error(erro);
        }
    }

    function editarCliente(cliente) {
            
        setClienteEditando(cliente.id);

        setNome(cliente.nome);
        setTelefone(cliente.telefone);
        setEmail(cliente.email);
    
    }

    const clientesFiltrados = clientes.filter((cliente) =>

        cliente.nome.toLowerCase().includes(pesquisa.toLowerCase()) ||

        cliente.telefone.toLowerCase().includes(pesquisa.toLowerCase()) ||

        cliente.email.toLowerCase().includes(pesquisa.toLowerCase())

    );



    return (
        <Layout>

            <h1>Clientes</h1>
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
                    + Novo Cliente
                </ActionButton>
            

                <SearchBar
                    value={pesquisa}
                    onChange={(e) => setPesquisa(e.target.value)}
                    placeholder="Pesquisar cliente..."
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

                <button 
                    onClick={cadastrarCliente}>
                    {clienteEditando ? "Salvar Alterações" : "Cadastrar"}
                </button>

            </div>

            <Table>

                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Telefone</th>
                        <th>Email</th>
                        <th>Ações</th>
                    </tr>
                </thead>

                <tbody>

                    {clientesFiltrados.map((cliente) => (

                        <tr key={cliente.id}>
                            <td>{cliente.id}</td>
                            <td>{cliente.nome}</td>
                            <td>{cliente.telefone}</td>
                            <td>{cliente.email}</td>

                            <td>

                                <EditButton
                                    onClick={() => editarCliente(cliente)}
                                />      
        
                                <DeleteButton
                                    onClick={() => excluirCliente(cliente.id)}
                                />

                            </td>

                        </tr>

                    ))}

                </tbody>

            </Table>

        </Layout>
    );
}