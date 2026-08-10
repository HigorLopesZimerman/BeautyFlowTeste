export default function EditButton({ onClick }) {
    return (
        <button
            onClick={onClick}
            style={{
                background: "#5b5aa7",
                color: "white",
                border: "none",
                padding: "6px 10px",
                borderRadius: "5px",
                cursor: "pointer",
                marginRight:"10px"
            }}
        >
            Editar
        </button>
    )
}