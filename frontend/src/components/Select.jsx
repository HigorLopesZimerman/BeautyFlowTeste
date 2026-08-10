export default function Select({
    value,
    onChange,
    children
}) {
    return (
        <select
            value={value}
            onChange={onChange}
            style={{
                padding: "10px 12px",
                border: "1px solid #ccc",
                borderRadius: "6px",
                background: "#3a3a3a",
                color: "white",
                cursor: "pointer",
                boxSizing: "border-box",
            }}
        >
            {children}
        </select>
    );
}