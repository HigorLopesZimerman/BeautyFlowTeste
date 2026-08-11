import { useState, useEffect } from "react";
import { getServicos, createServico, updateServico, deleteServico } from "../services/servicoService";

export function useServicos() {
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
            const data = await getServicos();
            setServicos(data);
        } catch (erro) {
            console.error(erro);
        }
    }

    async function cadastrarServico() {
        if (!nome || !duracao || !preco) {
            alert("Preencha todos os campos.");
            return;
        }

        try {
            if (servicoEditando) {
                await updateServico(servicoEditando, { nome, duracao, preco });
                setServicoEditando(null);
            } else {
                await createServico({ nome, duracao, preco });
            }

            setNome("");
            setDuracao("");
            setPreco("");
            carregarServicos();
        } catch (erro) {
            console.error(erro);
        }
    }

    async function excluirServico(id) {
        const confirmar = window.confirm("Deseja realmente excluir este serviço?");
        if (!confirmar) return;

        try {
            await deleteServico(id);
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
        servico.nome.toLowerCase().includes(pesquisa.toLowerCase())
    );

    return {
        nome, setNome,
        duracao, setDuracao,
        preco, setPreco,
        servicoEditando,
        pesquisa, setPesquisa,
        servicosFiltrados,
        cadastrarServico,
        excluirServico,
        editarServico
    };
}
