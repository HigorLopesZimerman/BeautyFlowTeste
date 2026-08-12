export const keepOnlyNumbers = (str) => {
    if (str === null || str === undefined) return "";
    return String(str).replace(/\D/g, "");
};

// Máscara de Telefone: (11) 99999-9999 ou (11) 9999-9999
export const formatPhone = (value) => {
    if (!value) return "";
    
    let numbers = keepOnlyNumbers(value);
    
    // Limita a 11 números (tamanho máximo de celular no Brasil)
    if (numbers.length > 11) {
        numbers = numbers.slice(0, 11);
    }
    
    if (numbers.length === 0) return "";
    if (numbers.length <= 2) return `(${numbers}`;
    if (numbers.length <= 6) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    if (numbers.length <= 10) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    
    // 11 digitos (celular novo)
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
};

// Máscara de Moeda (BRL)
export const formatCurrency = (value) => {
    if (value === null || value === undefined || value === "") return "";
    
    // Se for um número real vindo da API
    if (typeof value === "number") {
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }
    
    // Se for string sendo digitada pelo usuário no input
    let numbers = keepOnlyNumbers(value);
    
    if (numbers.length === 0) return "";
    
    while (numbers.length < 3) {
        numbers = "0" + numbers;
    }
    
    const cents = numbers.slice(-2);
    const reais = numbers.slice(0, -2);
    let cleanReais = parseInt(reais, 10).toString();
    cleanReais = cleanReais.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    
    return `R$ ${cleanReais},${cents}`;
};

// Converte de volta para número float (para enviar pro backend)
export const parseCurrencyToFloat = (value) => {
    if (!value) return 0;
    if (typeof value === "number") return value;
    
    let numbers = keepOnlyNumbers(value);
    if (!numbers) return 0;
    
    // Os últimos 2 dígitos são sempre centavos
    const floatStr = numbers.slice(0, -2) + "." + numbers.slice(-2);
    return parseFloat(floatStr);
};
