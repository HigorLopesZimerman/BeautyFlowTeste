import { useState, useEffect } from "react";
import { getDashboardData } from "../services/dashboardService";

export function useDashboard() {
    const [dados, setDados] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(null);

    useEffect(() => {
        carregar();
    }, []);

    async function carregar() {
        try {
            setCarregando(true);
            const dadosApi = await getDashboardData();
            setDados(dadosApi);
        } catch (error) {
            console.error(error);
            setErro("Falha ao carregar os dados do dashboard.");
        } finally {
            setCarregando(false);
        }
    }

    const proximoAgendamento = dados?.agenda_hoje?.length > 0 ? dados.agenda_hoje[0] : null;
    const proximo = dados?.proximo_atendimento;

    return { dados, carregando, erro, proximoAgendamento, proximo, recarregarDashboard: carregar };
}
