import { Routes, Route, Navigate } from "react-router-dom";
import { isAuthenticated } from "./services/authService";

import Dashboard from "./pages/Dashboard";
import Clientes from "./pages/Clientes";
import Funcionarios from "./pages/Funcionarios";
import Servicos from "./pages/Servicos";
import Agendamentos from "./pages/Agendamentos";
import Pagamentos from "./pages/Pagamentos";
import Relatorios from "./pages/Relatorios";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

// Componente para proteger rotas
const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      
      {/* Rotas Protegidas */}
      <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/clientes" element={<PrivateRoute><Clientes /></PrivateRoute>} />
      <Route path="/funcionarios" element={<PrivateRoute><Funcionarios /></PrivateRoute>} />
      <Route path="/servicos" element={<PrivateRoute><Servicos /></PrivateRoute>} />
      <Route path="/agendamentos" element={<PrivateRoute><Agendamentos /></PrivateRoute>} />
      <Route path="/pagamentos" element={<PrivateRoute><Pagamentos /></PrivateRoute>} />
      <Route path="/relatorios" element={<PrivateRoute><Relatorios /></PrivateRoute>} />
    </Routes>
  );
}

export default App;