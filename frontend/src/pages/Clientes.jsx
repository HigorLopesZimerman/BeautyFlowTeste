import { useClientes } from "../hooks/useClientes";
import Layout from "../components/Layout";
import SearchBar from "../components/SearchBar";
import ActionButton from "../components/ActionButton";
import EditButton from "../components/EditButton";
import DeleteButton from "../components/DeleteButton";
import Input from "../components/Input";
import Table from "../components/Table";

export default function Clientes() {
    const {
        nome, setNome,
        telefone, setTelefone,
        email, setEmail,
        clienteEditando,
        pesquisa, setPesquisa,
        clientesFiltrados,
        cadastrarCliente,
        excluirCliente,
        editarCliente
    } = useClientes();



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

                        <th>Nome</th>
                        <th>Telefone</th>
                        <th>Email</th>
                        <th>Ações</th>
                    </tr>
                </thead>

                <tbody>

                    {clientesFiltrados.map((cliente) => (

                        <tr key={cliente.id}>

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