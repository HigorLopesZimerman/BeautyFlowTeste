export default function Card({ titulo, valor, icon: Icon, colorClass = "primary" }) {
    return (
        <div
            style={{
                background: "var(--bg-surface)",
                borderRadius: "var(--radius-lg)",
                padding: "1.5rem",
                boxShadow: "var(--shadow-md)",
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
                border: "1px solid var(--border-color)",
                transition: "all 0.2s ease",
            }}
            className="hover-card"
        >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ margin: 0, fontSize: "1rem", color: "var(--text-muted)", fontWeight: "500" }}>
                    {titulo}
                </h3>
                {Icon && (
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: `var(--${colorClass}-light, rgba(0,0,0,0.05))`,
                        color: `var(--${colorClass})`
                    }}>
                        <Icon size={20} />
                    </div>
                )}
            </div>

            <p 
                style={{
                    margin: 0,
                    fontSize: "2rem",
                    fontWeight: "bold",
                    color: `var(--${colorClass})`,
                }}
            >
                {valor}
            </p>
        </div>
    );
}