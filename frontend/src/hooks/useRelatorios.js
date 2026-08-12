import { useState, useEffect } from "react";
import { getRelatorios } from "../services/relatorioService";

export function useRelatorios() {
    const [dados, setDados] = useState(null);
    const [inicio, setInicio] = useState("");
    const [fim, setFim] = useState("");

    useEffect(() => {
        carregarRelatorios();
    }, []);

    async function carregarRelatorios(dataInicio = "", dataFim = "") {
        try {
            const data = await getRelatorios(dataInicio, dataFim);
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
        await carregarRelatorios(inicio, fim);
    }

    return {
        dados,
        inicio, setInicio,
        fim, setFim,
        consultarPeriodo,
        limparFiltro: () => {
            setInicio("");
            setFim("");
            carregarRelatorios("", "");
        }
    };
}
