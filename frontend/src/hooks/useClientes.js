import { useState, useEffect } from "react";
import { getClientes, createCliente, updateCliente, deleteCliente } from "../services/clienteService";

export function useClientes() {
    const [clientes, setClientes] = useState([]);
    const [nome, setNome] = useState("");
    const [telefone, setTelefone] = useState("");
    const [email, setEmail] = useState("");
    const [nota, setNota] = useState("");
    const [clienteEditando, setClienteEditando] = useState(null);
    const [pesquisa, setPesquisa] = useState("");

    useEffect(() => {
        carregarClientes();
    }, []);

    async function carregarClientes() {
        try {
            const data = await getClientes();
            setClientes(data);
        } catch (erro) {
            console.error(erro);
        }
    }

    async function cadastrarCliente() {
        if (!nome || !telefone || !email) {
            alert("Preencha todos os campos.");
            return;
        }

        try {
            if (clienteEditando) {
                await updateCliente(clienteEditando, { nome, telefone, email, nota });
                setClienteEditando(null);
            } else {
                await createCliente({ nome, telefone, email, nota });
            }

            setNome("");
            setTelefone("");
            setEmail("");
            setNota("");
            carregarClientes();
        } catch (erro) {
            console.error(erro);
        }
    }

    async function excluirCliente(id) {
        const confirmar = window.confirm("Deseja realmente excluir este cliente?");
        if (!confirmar) return;

        try {
            await deleteCliente(id);
            carregarClientes();
        } catch (erro) {
            console.error(erro);
        }
    }

    function editarCliente(cliente) {
        if (!cliente) return;
        setClienteEditando(cliente.id);
        setNome(cliente.nome);
        setTelefone(cliente.telefone);
        setEmail(cliente.email || "");
        setNota(cliente.nota || "");
    }

    const clientesFiltrados = clientes.filter((cliente) =>
        cliente.nome.toLowerCase().includes(pesquisa.toLowerCase()) ||
        cliente.telefone.toLowerCase().includes(pesquisa.toLowerCase()) ||
        (cliente.email && cliente.email.toLowerCase().includes(pesquisa.toLowerCase())) ||
        (cliente.nota && cliente.nota.toLowerCase().includes(pesquisa.toLowerCase()))
    );

    return {
        nome, setNome,
        telefone, setTelefone,
        email, setEmail,
        nota, setNota,
        clienteEditando,
        pesquisa, setPesquisa,
        clientesFiltrados,
        cadastrarCliente,
        excluirCliente,
        editarCliente
    };
}
