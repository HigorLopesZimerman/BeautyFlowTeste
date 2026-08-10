export default function ActionButton({
    children,
    onClick
}) {

    return (

        <button
            onClick={onClick}
            style={{
                padding: "10px 20px",
                background: "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
            }}    
        >
            {children}
        </button>

    );

}