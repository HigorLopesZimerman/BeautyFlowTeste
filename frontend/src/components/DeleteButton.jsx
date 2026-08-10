export default function DeleteButton({ onClick }) {
    return (
        <button
            onClick={onClick}
            style={{
                background: "#dc2626",
                color: "white",
                border: "none",
                padding: "6px 10px",
                borderRadius: "5px",
                cursor: "pointer",
            }}
        >
            Excluir
        </button>
    );
}