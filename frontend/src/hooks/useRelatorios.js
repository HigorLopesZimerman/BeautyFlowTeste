import { useState, useEffect } from "react";
import { getRelatorios, getFaturamentoPeriodo } from "../services/relatorioService";

export function useRelatorios() {
    const [dados, setDados] = useState(null);
    const [inicio, setInicio] = useState("");
    const [fim, setFim] = useState("");
    const [faturamentoPeriodo, setFaturamentoPeriodo] = useState(null);

    useEffect(() => {
        carregarRelatorios();
    }, []);

    async function carregarRelatorios() {
        try {
            const data = await getRelatorios();
            setDados(data);
        } catch (erro) {
            console.error(erro);
        }
    }

    async function consultarPeriodo() {
        if (!inicio || !fim) {
            alert("Selecione as duas datas.");
            return;
        }

        try {
            const faturamento = await getFaturamentoPeriodo(inicio, fim);
            setFaturamentoPeriodo(faturamento);
        } catch (erro) {
            console.error(erro);
        }
    }

    return {
        dados,
        inicio, setInicio,
        fim, setFim,
        faturamentoPeriodo,
        consultarPeriodo
    };
}
