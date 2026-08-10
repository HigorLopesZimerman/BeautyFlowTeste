import { useEffect, useState } from "react";
import api from "../services/api";
import Layout from "../components/Layout";
import Card from "../components/Card";

export default function Relatorios() {

    const [dados, setDados] = useState(null);
    const [inicio, setInicio] = useState("");
    const [fim, setFim] = useState("");
    const [faturamentoPeriodo, setFaturamentoPeriodo] = useState(null);

    useEffect(() => {
        carregarRelatorios();
    }, []);

    async function carregarRelatorios() {

        try {

            const resposta = await api.get("/relatorios");

            setDados(resposta.data);

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

            const resposta = await api.get("/relatorios/faturamento", {

                params: {
                    inicio,
                    fim
                }

            });

            setFaturamentoPeriodo(resposta.data.faturamento);

        } catch (erro) {

            console.error(erro);

        }

    }


    if (!dados) {
        return <Layout><h2>Carregando...</h2></Layout>;
    }

    return (

            <Layout>

            <h1>Relatórios</h1>

            <div
                style={{
                        display:"flex",
                        gap: "10px",
                        justifyContent: "center"
                    }}
            >

            <input
                    type="date"
                    value={inicio}
                    onChange={(e) => setInicio(e.target.value)}
                />

                <input
                    type="date"
                    value={fim}
                    onChange={(e) => setFim(e.target.value)}
                />

                <button onClick={consultarPeriodo}>
                    Consultar
                </button>

            </div>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                    gap: "20px",
                    marginTop: "30px",
                }}
            >

            <div
                style={{
                    display: "flex",
                    gap: "10px",
                    alignItems: "center",
                    marginBottom: "30px",
                }}
            >

                

            </div>

            {faturamentoPeriodo !== null && (

                <Card
                    titulo="Faturamento no período"
                    valor={`R$ ${faturamentoPeriodo}`}
                    emoji="📈"
                />

            )}

                <Card
                    titulo="Serviço mais realizado"
                    valor={dados.servico.nome}
                    emoji="✂️"
                />

                <Card
                    titulo="Cliente mais frequente"
                    valor={dados.cliente.nome}
                    emoji="👤"
                />

                <Card
                    titulo="Funcionário destaque"
                    valor={dados.funcionario.nome}
                    emoji="💼"
                />

                <Card
                    titulo="Agendamentos"
                    valor={dados.total_agendamentos}
                    emoji="📅"
                />

                <Card
                    titulo="Cancelados"
                    valor={dados.agendamentos_cancelados}
                    emoji="❌"
                />

                <Card
                    titulo="Pendentes"
                    valor={dados.pagamentos_pendentes}
                    emoji="💳"
                />

                <Card
                    titulo="Valor Pendente"
                    valor={`R$ ${dados.valor_pendente}`}
                    emoji="💰"
                />

            </div>

        </Layout>
    );

    

}