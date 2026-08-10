export default function Input({
    type = "text",
    placeholder,
    value,
    onChange
}) {
    return (
        <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            style={{
                padding: "10px 12px",
                border: "1px solid #ccc",
                borderRadius: "6px",
                outline: "none",
                boxSizing: "border-box",
            }}
        />
    );
}