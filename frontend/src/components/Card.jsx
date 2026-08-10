export default function Card({ titulo, valor, emoji }) {
    return (
        <div
            style={{
                background: "white",
                borderRadius: "10px",
                padding: "20px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.15)",
                minWidth: "180px",
                textAlign: "center",
                
            }}
        >
            <h2 style={{ fontSize: "40px", margin: 0}}>
                {emoji}
            </h2>

            <h3>{titulo}</h3>

            <p 
                style={{
                    fontSize: "28px",
                    fontWeight: "bold",
                    color: "#2563eb",
                }}
            >
                {valor}
            </p>
        </div>
    );
}