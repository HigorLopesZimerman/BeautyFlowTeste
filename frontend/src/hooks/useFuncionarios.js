import { useState, useEffect } from "react";
import { getFuncionarios, createFuncionario, updateFuncionario, deleteFuncionario } from "../services/funcionarioService";

export function useFuncionarios() {
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
            const data = await getFuncionarios();
            setFuncionarios(data);
        } catch (erro) {
            console.error(erro);
        }
    }

    async function cadastrarFuncionario() {
        if (!nome || !funcao || !telefone || !email) {
            alert("Preencha todos os campos.");
            return;
        }

        try {
            if (funcionarioEditando) {
                await updateFuncionario(funcionarioEditando, { nome, funcao, telefone, email });
                setFuncionarioEditando(null);
            } else {
                await createFuncionario({ nome, funcao, telefone, email });
            }

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
        const confirmar = window.confirm("Deseja realmente excluir este funcionário?");
        if (!confirmar) return;

        try {
            await deleteFuncionario(id);
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
        funcionario.nome.toLowerCase().includes(pesquisa.toLowerCase())
    );

    return {
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
    };
}
