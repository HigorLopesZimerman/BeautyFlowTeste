import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import { Lock, Mail, ArrowRight } from "lucide-react";
import "../index.css";

export default function Login() {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(false);
    
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErro("");
        
        if (!email || !senha) {
            setErro("Preencha todos os campos.");
            return;
        }

        setCarregando(true);
        try {
            const data = await login(email, senha);
            // Salva o token falso e navega para o dashboard
            localStorage.setItem("token", data.token);
            localStorage.setItem("usuario", JSON.stringify(data.usuario));
            navigate("/");
        } catch (error) {
            setErro(error.message);
        } finally {
            setCarregando(false);
        }
    };

    return (
        <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            background: "linear-gradient(135deg, var(--primary) 0%, #1e3a8a 100%)",
            width: "100%",
            padding: "1rem"
        }}>
            <div style={{
                background: "var(--bg-surface)",
                padding: "3rem",
                borderRadius: "var(--radius-xl)",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                width: "100%",
                maxWidth: "450px",
                textAlign: "center"
            }}>
                
                <div style={{ marginBottom: "2rem" }}>
                    <div style={{ 
                        width: "60px", 
                        height: "60px", 
                        background: "var(--primary-light)", 
                        borderRadius: "16px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 1rem auto",
                        color: "var(--primary)"
                    }}>
                        <Lock size={32} />
                    </div>
                    <h1 style={{ margin: "0 0 0.5rem 0", color: "var(--text-main)", fontSize: "2rem" }}>BeautyFlow</h1>
                    <p style={{ color: "var(--text-muted)", margin: 0 }}>Gestão inteligente para o seu salão</p>
                </div>

                {erro && (
                    <div style={{ 
                        background: "#fef2f2", 
                        color: "var(--danger)", 
                        padding: "1rem", 
                        borderRadius: "var(--radius-md)",
                        marginBottom: "1.5rem",
                        fontSize: "0.9rem",
                        border: "1px solid #fca5a5"
                    }}>
                        {erro}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ textAlign: "left" }}>
                    <div className="form-group" style={{ marginBottom: "1.5rem" }}>
                        <label>E-mail</label>
                        <div style={{ position: "relative" }}>
                            <Mail size={20} style={{ position: "absolute", left: "12px", top: "12px", color: "var(--text-muted)" }} />
                            <input
                                type="email"
                                className="input-field"
                                style={{ paddingLeft: "40px" }}
                                placeholder="ex: admin@beautyflow.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: "2rem" }}>
                        <label>Senha</label>
                        <div style={{ position: "relative" }}>
                            <Lock size={20} style={{ position: "absolute", left: "12px", top: "12px", color: "var(--text-muted)" }} />
                            <input
                                type="password"
                                className="input-field"
                                style={{ paddingLeft: "40px" }}
                                placeholder="Sua senha"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className="btn btn-primary" 
                        style={{ width: "100%", justifyContent: "center", padding: "0.8rem", fontSize: "1.1rem" }}
                        disabled={carregando}
                    >
                        {carregando ? "Entrando..." : "Entrar no Sistema"}
                        {!carregando && <ArrowRight size={20} />}
                    </button>
                </form>

                <div style={{ marginTop: "2rem", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                    Para testar o MVP, use:<br/>
                    <strong>admin@beautyflow.com</strong> / <strong>admin123</strong>
                </div>
            </div>
        </div>
    );
}
