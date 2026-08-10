import { Link } from "react-router-dom";

export default function Layout({ children }) {
    return (
        <div style={{ display: "flex", minHeight: "100vh" }}>

            <aside
                style={{
                    width: "220px",
                    background: "#1f2937",
                    color: "white",
                    padding: "20px",
                }}
            >
                <h2>BeautyFlow</h2>

                <nav
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                        marginTop: "30px",
                    }}
                >
                    <Link to="/">Dashboard</Link>
                    <Link to="/relatorios">Relatórios</Link>
                    <Link to="/clientes">Clientes</Link>
                    <Link to="/funcionarios">Funcionários</Link>
                    <Link to="/servicos">Serviços</Link>
                    <Link to="/agendamentos">Agendamentos</Link>
                    <Link to="/pagamentos">Pagamentos</Link>

                </nav>
            </aside>

            <main
                style={{
                    flex: 1,
                    padding: "30px",
                    background: "#9caac9",
                    color: "#111827",
                }}
            >
                {children}
            </main>
        </div>
    );
}