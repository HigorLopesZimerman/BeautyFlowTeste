import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../services/authService";
import { Lock, Mail, User, ArrowRight, Scissors } from "lucide-react";
import "../index.css";

export default function Cadastro() {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [erro, setErro] = useState("");
    const [sucesso, setSucesso] = useState("");
    const [carregando, setCarregando] = useState(false);
    
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErro("");
        setSucesso("");
        
        if (!nome || !email || !senha || !confirmarSenha) {
            setErro("Preencha todos os campos.");
            return;
        }

        if (senha !== confirmarSenha) {
            setErro("As senhas não coincidem.");
            return;
        }

        setCarregando(true);
        try {
            const data = await register(nome, email, senha);
            setSucesso(data.mensagem);
            setNome("");
            setEmail("");
            setSenha("");
            setConfirmarSenha("");
            // Redireciona para o login após 2 segundos
            setTimeout(() => {
                navigate("/login");
            }, 2000);
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
                        <Scissors size={32} />
                    </div>
                    <h1 style={{ margin: "0 0 0.5rem 0", color: "var(--text-main)", fontSize: "2rem" }}>Criar Conta</h1>
                    <p style={{ color: "var(--text-muted)", margin: 0 }}>Cadastre-se no BeautyFlow</p>
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

                {sucesso && (
                    <div style={{ 
                        background: "#f0fdf4", 
                        color: "#166534", 
                        padding: "1rem", 
                        borderRadius: "var(--radius-md)",
                        marginBottom: "1.5rem",
                        fontSize: "0.9rem",
                        border: "1px solid #bbf7d0"
                    }}>
                        {sucesso}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ textAlign: "left" }}>
                    <div className="form-group" style={{ marginBottom: "1.2rem" }}>
                        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", fontSize: "0.9rem", color: "var(--text-main)" }}>Nome Completo</label>
                        <div style={{ position: "relative" }}>
                            <User size={20} style={{ position: "absolute", left: "12px", top: "12px", color: "var(--text-muted)" }} />
                            <input
                                type="text"
                                className="input-field"
                                style={{ paddingLeft: "40px", width: "100%", height: "45px", boxSizing: "border-box" }}
                                placeholder="Seu nome"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                disabled={carregando}
                            />
                        </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: "1.2rem" }}>
                        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", fontSize: "0.9rem", color: "var(--text-main)" }}>E-mail</label>
                        <div style={{ position: "relative" }}>
                            <Mail size={20} style={{ position: "absolute", left: "12px", top: "12px", color: "var(--text-muted)" }} />
                            <input
                                type="email"
                                className="input-field"
                                style={{ paddingLeft: "40px", width: "100%", height: "45px", boxSizing: "border-box" }}
                                placeholder="ex: seuemail@provedor.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={carregando}
                            />
                        </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: "1.2rem" }}>
                        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", fontSize: "0.9rem", color: "var(--text-main)" }}>Senha</label>
                        <div style={{ position: "relative" }}>
                            <Lock size={20} style={{ position: "absolute", left: "12px", top: "12px", color: "var(--text-muted)" }} />
                            <input
                                type="password"
                                className="input-field"
                                style={{ paddingLeft: "40px", width: "100%", height: "45px", boxSizing: "border-box" }}
                                placeholder="Sua senha"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                disabled={carregando}
                            />
                        </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: "1.8rem" }}>
                        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", fontSize: "0.9rem", color: "var(--text-main)" }}>Confirmar Senha</label>
                        <div style={{ position: "relative" }}>
                            <Lock size={20} style={{ position: "absolute", left: "12px", top: "12px", color: "var(--text-muted)" }} />
                            <input
                                type="password"
                                className="input-field"
                                style={{ paddingLeft: "40px", width: "100%", height: "45px", boxSizing: "border-box" }}
                                placeholder="Confirme sua senha"
                                value={confirmarSenha}
                                onChange={(e) => setConfirmarSenha(e.target.value)}
                                disabled={carregando}
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className="btn btn-primary" 
                        disabled={carregando}
                        style={{ 
                            width: "100%", 
                            height: "48px",
                            display: "flex", 
                            alignItems: "center", 
                            justifyContent: "center", 
                            gap: "0.5rem",
                            fontSize: "1rem",
                            fontWeight: "600",
                            border: "none",
                            borderRadius: "var(--radius-md)"
                        }}
                    >
                        {carregando ? "Criando conta..." : "Criar Conta"}
                        {!carregando && <ArrowRight size={18} />}
                    </button>
                </form>

                <div style={{ marginTop: "2rem", color: "var(--text-muted)", fontSize: "0.9rem" }}>
                    Já tem uma conta?{" "}
                    <Link to="/login" style={{ color: "var(--primary)", fontWeight: "600", textDecoration: "none" }}>
                        Fazer Login
                    </Link>
                </div>

            </div>
        </div>
    );
}
