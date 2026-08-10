export default function StatusBadge({ status }) {

    const estilos = {
        agendado: {
            background: "#fef3c7",
            color: "#92400e",
        },

        concluido: {
            background: "#dcfce7",
            color: "#166534",
        },

        cancelado: {
            background: "#fee2e2",
            color: "#991b1b",
        },

        pendente: {
            background: "#fef3c7",
            color: "#92400e",
        },

        pago: {
            background: "#dcfce7",
            color: "#166534",
        },
    };

    const nomes = {
        agendado: "Agendado",
        concluido: "Concluído",
        cancelado: "Cancelado",
        pendente: "Pendente",
        pago: "Pago",
    };

    const estilo = estilos[status?.toLowerCase()] || {
        background: "#e5e7eb",
        color: "#374151",
    };

    return (
        <span
            style={{
                ...estilo,
                padding: "5px 10px",
                borderRadius: "999px",
                fontSize: "13px",
                fontWeight: "600",
                display: "inline-block",
            }}
        >
            {nomes[status?.toLowerCase()] || status}
        </span>
    );
}