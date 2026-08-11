import { useDashboard } from "../hooks/useDashboard";
import Layout from "../components/Layout";
import Card from "../components/Card";

export default function Dashboard() {
    const { dados, carregando, erro, proximoAgendamento, proximo } = useDashboard();

    if (carregando) {
        return <h2>Carregando...</h2>;
    }

    if (erro) {
        return <h2>{erro}</h2>;
    }


    return (
        <Layout>
            <h1>Bom Dia!</h1>

            {proximoAgendamento && (

                <div
                    style={{
                        background: "#2563eb",
                        color: "white",
                        padding: "20px",
                        borderRadius: "10px",
                        marginTop: "25px",
                        marginBottom: "30px",
                        textAlign: "left",
                    }}
                >

                    <h2 style={{ margin: 0 }}>
                        📅 Próximo Atendimento
                    </h2>

                    <p style={{ marginTop: "15px" }}>
                        <strong>{proximoAgendamento.hora}</strong>
                    </p>

                    <p>
                        {proximoAgendamento.cliente}
                    </p>

                    <p>
                        ✂️ {proximoAgendamento.servico}
                    </p>

                </div>

            )}

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "20px",
                    marginTop: "30px",
                }}
            >

            <Card
                titulo="Pendentes"
                valor={`R$ ${dados.valor_pendente}`}
                emoji="🟡"
            />

            <Card
                titulo="Clientes"
                valor={dados.clientes}
                emoji="👥"
            />

            <Card
                titulo="Funcionários"
                valor={dados.funcionarios}
                emoji="💼"
            />

            <Card
                titulo="Serviços"
                valor={dados.servicos}
                emoji="✂️"
            />

            <Card
                titulo="Agendamentos"
                valor={dados.agendamentos}
                emoji="📅"
            />

            <Card
                titulo="Pagamentos"
                valor={dados.pagamentos}
                emoji="💳"
            />

            <Card
                titulo="Faturamento"
                valor={`R$ ${dados.faturamento}`}
                emoji="💰"
            />
            
            </div>

            {proximo && (

                <div
                    style={{
                        marginTop: "35px",
                        padding: "20px",
                        border: "1px solid #ddd",
                        borderRadius: "10px",
                        textAlign: "left",
                        background: "#fff",
                    }}
                >

                    <h2>Próximo Atendimento</h2>

                    <p>
                        <strong>Cliente:</strong> {proximo.cliente}
                    </p>

                    <p>
                        <strong>Serviço:</strong> {proximo.servico}
                    </p>

                    <p>
                        <strong>Data:</strong>{" "}
                        {proximo.data.split("-").reverse().join("/")}
                    </p>

                    <p>
                        <strong>Hora:</strong> {proximo.hora}
                    </p>

                </div>

            )}

            <div
                style={{
                    marginTop: "40px",
                    background: "#fff",
                    borderRadius: "10px",
                    padding: "20px",
                    color: "#000",
                    textAlign: "left",
                }}
            >

                <h2 style={{ marginBottom: "20px" }}>
                    📅 Agenda de Hoje
                </h2>

                {dados.agenda_hoje.length === 0 ? (

                    <p>Nenhum agendamento para hoje.</p>

                ) : (

                    dados.agenda_hoje.map((agendamento, index) => (

                        <div
                            key={index}
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                padding: "12px 0",
                                borderBottom: "1px solid #ddd",
                            }}
                        >

                            <div>

                                <strong>{agendamento.hora}</strong>

                                <br />

                                {agendamento.cliente}

                            </div>

                            <div>

                                ✂️ {agendamento.servico}

                            </div>

                        </div>

                    ))

                )}

            </div>

        </Layout>
    );
}