import { useState } from "react";
import { useAgendamentos } from "../hooks/useAgendamentos";
import { Search, Plus, Edit2, Trash2 } from "lucide-react";
import Layout from "../components/Layout";
import Modal from "../components/Modal";

export default function Agendamentos() {
    const {
        clientes, funcionarios, servicos,
        clienteId, setClienteId,
        funcionarioId, setFuncionarioId,
        servicoId, setServicoId,
        data, setData,
        hora, setHora,
        status,
        agendamentoEditando,
        filtroStatus, setFiltroStatus,
        pesquisa, setPesquisa,
        agendamentosFiltrados,
        cadastrarAgendamento,
        excluirAgendamento,
        alterarStatus,
        editarAgendamento
    } = useAgendamentos();

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = (agendamento = null) => {
        if (agendamento) {
            editarAgendamento(agendamento);
        } else {
            setClienteId("");
            setFuncionarioId("");
            setServicoId("");
            setData("");
            setHora("");
            editarAgendamento(null);
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        await cadastrarAgendamento();
        setIsModalOpen(false);
    };

    // Função auxiliar para renderizar a badge de status corretamente
    const renderStatusBadge = (statusValue) => {
        let badgeClass = "badge-neutral";
        let label = "Agendado";
        
        if (statusValue === "concluido") {
            badgeClass = "badge-success";
            label = "Concluído";
        } else if (statusValue === "cancelado") {
            badgeClass = "badge-danger";
            label = "Cancelado";
        } else if (statusValue === "agendado") {
            badgeClass = "badge-warning";
            label = "Agendado";
        }

        return <span className={`badge ${badgeClass}`}>{label}</span>;
    };

    return (
        <Layout>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ margin: 0 }}>Agendamentos</h1>
                <button className="btn btn-primary" onClick={() => handleOpenModal()}>
                    <Plus size={20} />
                    Novo Agendamento
                </button>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ position: 'relative', flex: '1', minWidth: '250px', maxWidth: '400px' }}>
                    <Search size={20} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
                    <input
                        className="input-field"
                        style={{ paddingLeft: '40px' }}
                        value={pesquisa}
                        onChange={(e) => setPesquisa(e.target.value)}
                        placeholder="Pesquisar por cliente, funcionário ou serviço..."
                    />
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                        className={`btn ${filtroStatus === "Todos" ? "btn-primary" : "btn-outline"}`}
                        onClick={() => setFiltroStatus("Todos")}
                    >
                        Todos
                    </button>
                    <button 
                        className={`btn ${filtroStatus === "agendado" ? "btn-warning" : "btn-outline"}`}
                        onClick={() => setFiltroStatus("agendado")}
                    >
                        Agendados
                    </button>
                    <button 
                        className={`btn ${filtroStatus === "concluido" ? "btn-success" : "btn-outline"}`}
                        onClick={() => setFiltroStatus("concluido")}
                    >
                        Concluídos
                    </button>
                    <button 
                        className={`btn ${filtroStatus === "cancelado" ? "btn-danger" : "btn-outline"}`}
                        onClick={() => setFiltroStatus("cancelado")}
                    >
                        Cancelados
                    </button>
                </div>
            </div>

            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Cliente</th>
                            <th>Funcionário</th>
                            <th>Serviço</th>
                            <th>Data</th>
                            <th>Hora</th>
                            <th>Status</th>
                            <th style={{ width: '120px' }}>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {agendamentosFiltrados.map((agendamento) => (
                            <tr key={agendamento.id}>
                                <td>{agendamento.cliente}</td>
                                <td>{agendamento.funcionario}</td>
                                <td>{agendamento.servico}</td>
                                <td>{agendamento.data.split('-').reverse().join('/')}</td>
                                <td>{agendamento.hora}</td>
                                <td>
                                    <select
                                        className="input-field"
                                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.9rem', width: 'auto' }}
                                        value={agendamento.status}
                                        onChange={(e) => alterarStatus(agendamento.id, e.target.value)}
                                    >
                                        <option value="agendado">🟡 Agendado</option>
                                        <option value="concluido">🟢 Concluído</option>
                                        <option value="cancelado">🔴 Cancelado</option>
                                    </select>
                                </td>
                                <td>
                                    <div className="actions-cell">
                                        <button 
                                            className="icon-btn" 
                                            title="Editar"
                                            onClick={() => handleOpenModal(agendamento)}
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button 
                                            className="icon-btn danger" 
                                            title="Excluir"
                                            onClick={() => {
                                                if(window.confirm("Deseja realmente excluir este agendamento?")) {
                                                    excluirAgendamento(agendamento.id);
                                                }
                                            }}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {agendamentosFiltrados.length === 0 && (
                            <tr>
                                <td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                                    Nenhum agendamento encontrado.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Modal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
                title={agendamentoEditando ? "Editar Agendamento" : "Novo Agendamento"}
            >
                <form onSubmit={handleSave}>
                    
                    <div className="form-group">
                        <label>Cliente *</label>
                        <select
                            className="input-field"
                            value={clienteId}
                            onChange={(e) => setClienteId(e.target.value)}
                            required
                        >
                            <option value="">Selecione um cliente...</option>
                            {clientes.map((c) => (
                                <option key={c.id} value={c.id}>{c.nome}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Funcionário *</label>
                        <select
                            className="input-field"
                            value={funcionarioId}
                            onChange={(e) => setFuncionarioId(e.target.value)}
                            required
                        >
                            <option value="">Selecione um funcionário...</option>
                            {funcionarios.map((f) => (
                                <option key={f.id} value={f.id}>{f.nome} - {f.funcao}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Serviço *</label>
                        <select
                            className="input-field"
                            value={servicoId}
                            onChange={(e) => setServicoId(e.target.value)}
                            required
                        >
                            <option value="">Selecione um serviço...</option>
                            {servicos.map((s) => (
                                <option key={s.id} value={s.id}>{s.nome} (R$ {s.preco})</option>
                            ))}
                        </select>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Data *</label>
                            <input
                                className="input-field"
                                type="date"
                                value={data}
                                onChange={(e) => setData(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Hora *</label>
                            <input
                                className="input-field"
                                type="time"
                                value={hora}
                                onChange={(e) => setHora(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
                        <button type="button" className="btn" onClick={() => setIsModalOpen(false)}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn btn-primary">
                            {agendamentoEditando ? "Salvar Alterações" : "Cadastrar"}
                        </button>
                    </div>
                </form>
            </Modal>

        </Layout>
    );
}