import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, UserSquare2, Scissors, CalendarDays, Wallet, BarChart3, LogOut, Sparkles } from "lucide-react";
import { logout } from "../services/authService";
import "./Layout.css";

export default function Layout({ children }) {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const menuItems = [
        { path: "/", label: "Dashboard", icon: LayoutDashboard },
        { path: "/clientes", label: "Clientes", icon: Users },
        { path: "/funcionarios", label: "Funcionários", icon: UserSquare2 },
        { path: "/servicos", label: "Serviços", icon: Scissors },
        { path: "/agendamentos", label: "Agendamentos", icon: CalendarDays },
        { path: "/pagamentos", label: "Pagamentos", icon: Wallet },
        { path: "/relatorios", label: "Relatórios", icon: BarChart3 },
    ];

    return (
        <div className="layout-container">
            <aside className="sidebar">
                <h2>
                    <Scissors size={28} className="text-primary" style={{ marginRight: '8px' }} /> BeautyFlow
                </h2>
                
                <nav className="nav-menu">
                    {menuItems.map((item) => (
                        <Link 
                            key={item.path} 
                            to={item.path}
                            className={`nav-link ${location.pathname === item.path ? "active" : ""}`}
                        >
                            <item.icon size={20} />
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="logout-container" style={{ marginTop: 'auto', padding: '1rem', borderTop: '1px solid var(--border-color)' }}>
                    <button 
                        onClick={handleLogout}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            width: '100%',
                            padding: '12px',
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--danger)',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontWeight: '500',
                            borderRadius: 'var(--radius-md)',
                            transition: 'all 0.2s ease',
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = '#fef2f2'}
                        onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                        <LogOut size={20} />
                        Sair do Sistema
                    </button>
                </div>
            </aside>

            <main className="main-content">
                {children}
            </main>
        </div>
    );
}