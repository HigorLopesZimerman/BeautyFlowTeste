import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../services/api";
import SearchBar from "../components/SearchBar";
import ActionButton from "../components/ActionButton";
import EditButton from "../components/EditButton";
import DeleteButton from "../components/DeleteButton";
import Input from "../components/Input";
import Table from "../components/Table";

export default function Servicos() {

    const [servicos, setServicos] = useState([]);
    const [pesquisa, setPesquisa] = useState("");
    const [nome, setNome] = useState("");
    const [duracao, setDuracao] = useState("");
    const [preco, setPreco] = useState("");
    const [servicoEditando, setServicoEditando] = useState(null);


    useEffect(() => {
        carregarServicos();
    }, []);

    async function carregarServicos() {
        try {
            const resposta = await api.get("/servicos");
            setServicos(resposta.data);
        } catch (erro) {
            console.error(erro);
        }
    }

    async function cadastrarServico() {

        if (!nome || !duracao || !preco) {
            alert("Preencha todos os campos.");
            return;
        }

        if (servicoEditando) {

            try {

                await api.put(`/servicos/${servicoEditando}`, {
                    nome,
                    duracao,
                    preco
                });

                setServicoEditando(null);
                setNome("");
                setDuracao("");
                setPreco("");

                carregarServicos();

                return;

            } catch (erro) {
                console.error(erro);
                return;
            }
        }

        try {

            await api.post("/servicos", {
                nome,
                duracao,
                preco
            });

            setNome("");
            setDuracao("");
            setPreco("");

            carregarServicos();

        } catch (erro) {
            console.error(erro);
        }
    }

    async function excluirServico(id) {

        const confirmar = window.confirm(
            "Deseja realmente excluir este serviço?"
        );

        if (!confirmar) {
            return;
        }

        try {

            await api.delete(`/servicos/${id}`);

            carregarServicos();

        } catch (erro) {
            console.error(erro);
        }
    }

    function editarServico(servico) {

        setServicoEditando(servico.id);

        setNome(servico.nome);
        setDuracao(servico.duracao);
        setPreco(servico.preco);

    }

    const servicosFiltrados = servicos.filter((servico) =>

        servico.nome
            .toLowerCase()
            .includes(pesquisa.toLowerCase())

    );


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
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Duração(min)</th>
                        <th>Preço</th>
                        <th>Ações</th>
                    </tr>
                </thead>

                <tbody>

                    {servicosFiltrados.map((servico) => (

                        <tr key={servico.id}>
                            <td>{servico.id}</td>
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