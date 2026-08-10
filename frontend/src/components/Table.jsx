export default function Table({ children }) {

    return (
        <table
            style={{
                width: "100%",
                marginTop: "0",
                borderCollapse: "separate",
                borderSpacing: "0 8px",
            }}
        >
            {children}
        </table>
    );

}