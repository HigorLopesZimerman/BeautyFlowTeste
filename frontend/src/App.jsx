import { Routes, Route} from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Clientes from "./pages/Clientes";
import Funcionarios from "./pages/Funcionarios";
import Servicos from "./pages/Servicos";
import Agendamentos from "./pages/Agendamentos";
import Pagamentos from "./pages/Pagamentos";
import Relatorios from "./pages/Relatorios";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/clientes" element={<Clientes />} />
      <Route path="/funcionarios" element={<Funcionarios />} />
      <Route path="/servicos" element={<Servicos />} />
      <Route path="/agendamentos" element={<Agendamentos />} />
      <Route path="/pagamentos" element={<Pagamentos />} />
      <Route path="/relatorios" element={<Relatorios />}
/>
    </Routes>
  );
}

export default App;