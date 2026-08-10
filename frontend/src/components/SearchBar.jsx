export default function SearchBar({
    value,
    onChange,
    placeholder = "Pesquisar..."
}) {

    return(
        <input
            type="text"
            placeholder={`🔍 ${placeholder}`}
            value={value}
            onChange={onChange}
            style={{
                width: "300px",
                padding: "10px 12px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                boxSizing: "border-box",
            }}
        />
    );

}