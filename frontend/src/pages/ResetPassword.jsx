import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import api from "../services/api";

function ResetPassword() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const navigate = useNavigate();

    const [novaSenha, setNovaSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState("");
    const [sucesso, setSucesso] = useState("");

    useEffect(() => {
        if (!token) {
            setErro("Nenhum token de recuperação fornecido na URL.");
        }
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErro("");
        setSucesso("");

        if (!token) {
            setErro("URL inválida ou link expirado.");
            return;
        }

        if (novaSenha !== confirmarSenha) {
            setErro("As senhas não coincidem.");
            return;
        }

        if (novaSenha.length < 6) {
            setErro("A nova senha deve ter pelo menos 6 caracteres.");
            return;
        }

        setLoading(true);

        try {
            const resposta = await api.post("/auth/reset-password", { 
                token: token,
                nova_senha: novaSenha 
            });
            setSucesso(resposta.data.mensagem);
            
            // Redirecionar para login após 3 segundos
            setTimeout(() => {
                navigate("/login");
            }, 3000);
            
        } catch (err) {
            setErro(err.response?.data?.erro || "Erro ao conectar com o servidor.");
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", backgroundColor: "var(--background)", padding: "1rem" }}>
                <div style={{ backgroundColor: "var(--surface)", padding: "2.5rem", borderRadius: "1rem", maxWidth: "400px", textAlign: "center" }}>
                    <h2 style={{ fontSize: "1.5rem", color: "var(--text)", marginBottom: "1rem" }}>Link Inválido</h2>
                    <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>
                        Parece que o link que você acessou está quebrado ou incompleto.
                    </p>
                    <Link to="/forgot-password" style={{ display: "inline-block", padding: "0.75rem 1.5rem", backgroundColor: "var(--primary)", color: "white", borderRadius: "0.5rem", textDecoration: "none", fontWeight: "600" }}>
                        Solicitar novo link
                    </Link>
                </div>
            </div>
        );
    }

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
                    Criar Nova Senha
                </h2>
                <p style={{ color: "var(--text-muted)", marginBottom: "2rem", fontSize: "0.95rem" }}>
                    Digite sua nova senha abaixo. Use algo seguro que você vai lembrar!
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
                    <div style={{ marginBottom: "1rem", textAlign: "left" }}>
                        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", color: "var(--text)", fontSize: "0.9rem" }}>
                            Nova Senha
                        </label>
                        <input
                            type="password"
                            value={novaSenha}
                            onChange={(e) => setNovaSenha(e.target.value)}
                            placeholder="Mínimo 6 caracteres"
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
                    
                    <div style={{ marginBottom: "1.5rem", textAlign: "left" }}>
                        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", color: "var(--text)", fontSize: "0.9rem" }}>
                            Confirmar Nova Senha
                        </label>
                        <input
                            type="password"
                            value={confirmarSenha}
                            onChange={(e) => setConfirmarSenha(e.target.value)}
                            placeholder="Repita a senha"
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
                        disabled={loading || sucesso !== ""}
                        style={{
                            width: "100%",
                            padding: "0.875rem",
                            borderRadius: "0.5rem",
                            border: "none",
                            backgroundColor: "var(--primary)",
                            color: "white",
                            fontWeight: "600",
                            fontSize: "1rem",
                            cursor: (loading || sucesso !== "") ? "not-allowed" : "pointer",
                            opacity: (loading || sucesso !== "") ? 0.7 : 1,
                            transition: "opacity 0.2s"
                        }}
                    >
                        {loading ? "Salvando..." : "Redefinir Senha"}
                    </button>
                </form>

            </div>
        </div>
    );
}

export default ResetPassword;
