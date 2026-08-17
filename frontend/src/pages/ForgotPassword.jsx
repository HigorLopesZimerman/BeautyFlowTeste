import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState("");
    const [sucesso, setSucesso] = useState("");
    const [tokenSimulado, setTokenSimulado] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErro("");
        setSucesso("");
        setTokenSimulado("");
        setLoading(true);

        try {
            const resposta = await api.post("/auth/forgot-password", { email });
            setSucesso(resposta.data.mensagem);
            if (resposta.data.reset_token) {
                setTokenSimulado(resposta.data.reset_token);
            }
        } catch (err) {
            setErro(err.response?.data?.erro || "Erro ao conectar com o servidor.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            backgroundColor: "var(--background)",
            padding: "1rem"
        }}>
            <div style={{
                backgroundColor: "var(--surface)",
                padding: "2.5rem",
                borderRadius: "1rem",
                width: "100%",
                maxWidth: "400px",
                boxShadow: "var(--shadow-lg)",
                border: "1px solid var(--border)",
                textAlign: "center"
            }}>
                <h2 style={{ fontSize: "1.8rem", marginBottom: "0.5rem", color: "var(--text)" }}>
                    Esqueceu a senha?
                </h2>
                <p style={{ color: "var(--text-muted)", marginBottom: "2rem", fontSize: "0.95rem" }}>
                    Digite seu e-mail e nós te enviaremos um link para redefinir sua senha.
                </p>

                {erro && (
                    <div style={{ backgroundColor: "#fee2e2", color: "#dc2626", padding: "0.75rem", borderRadius: "0.5rem", marginBottom: "1rem", fontSize: "0.9rem" }}>
                        {erro}
                    </div>
                )}
                {sucesso && (
                    <div style={{ backgroundColor: "#dcfce7", color: "#16a34a", padding: "0.75rem", borderRadius: "0.5rem", marginBottom: "1rem", fontSize: "0.9rem" }}>
                        {sucesso}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: "1.5rem", textAlign: "left" }}>
                        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", color: "var(--text)", fontSize: "0.9rem" }}>
                            E-mail da sua conta
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="exemplo@email.com"
                            style={{
                                width: "100%",
                                padding: "0.75rem 1rem",
                                borderRadius: "0.5rem",
                                border: "1px solid var(--border)",
                                backgroundColor: "var(--background)",
                                color: "var(--text)",
                                fontSize: "1rem",
                                boxSizing: "border-box"
                            }}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: "100%",
                            padding: "0.875rem",
                            borderRadius: "0.5rem",
                            border: "none",
                            backgroundColor: "var(--primary)",
                            color: "white",
                            fontWeight: "600",
                            fontSize: "1rem",
                            cursor: loading ? "not-allowed" : "pointer",
                            opacity: loading ? 0.7 : 1,
                            transition: "opacity 0.2s"
                        }}
                    >
                        {loading ? "Enviando..." : "Enviar link de recuperação"}
                    </button>
                </form>

                {tokenSimulado && (
                    <div style={{ marginTop: "1.5rem", padding: "1rem", border: "1px dashed var(--primary)", borderRadius: "0.5rem", textAlign: "left", fontSize: "0.85rem", backgroundColor: "var(--background)" }}>
                        <strong style={{ color: "var(--primary)" }}>[MODO MVP] E-mail simulado:</strong><br/><br/>
                        Clique no link abaixo para recuperar (ou copie a URL):<br/>
                        <Link to={`/reset-password?token=${tokenSimulado}`} style={{ color: "var(--primary)", wordBreak: "break-all" }}>
                            /reset-password?token={tokenSimulado}
                        </Link>
                    </div>
                )}

                <div style={{ marginTop: "2rem", color: "var(--text-muted)", fontSize: "0.9rem" }}>
                    Lembrou a senha?{" "}
                    <Link to="/login" style={{ color: "var(--primary)", fontWeight: "600", textDecoration: "none" }}>
                        Voltar ao login
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
