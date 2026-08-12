const API_URL = "http://127.0.0.1:5000";

export const login = async (email, senha) => {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, senha }),
    });

    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(data.erro || "Erro ao fazer login");
    }
    
    return data;
};

export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
};

export const isAuthenticated = () => {
    return !!localStorage.getItem("token");
};
