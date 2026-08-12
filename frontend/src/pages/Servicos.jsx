import { useState } from "react";
import { useServicos } from "../hooks/useServicos";
import { Search, Plus, Edit2, Trash2 } from "lucide-react";
import Layout from "../components/Layout";
import Modal from "../components/Modal";

export default function Servicos() {
    const {
        nome, setNome,
        duracao, setDuracao,
        preco, setPreco,
        servicoEditando,
        pesquisa, setPesquisa,
        servicosFiltrados,
        cadastrarServico,
        excluirServico,
        editarServico
    } = useServicos();

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = (servico = null) => {
        if (servico) {
            editarServico(servico);
        } else {
            setNome("");
            setDuracao("");
            setPreco("");
            editarServico(null);
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        await cadastrarServico();
        setIsModalOpen(false);
    };

    return (
        <Layout>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ margin: 0 }}>Serviços</h1>
                <button className="btn btn-primary" onClick={() => handleOpenModal()}>
                    <Plus size={20} />
                    Novo Serviço
                </button>
            </div>

            <div style={{ position: 'relative', marginBottom: '1.5rem', maxWidth: '400px' }}>
                <Search size={20} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
                <input
                    className="input-field"
                    style={{ paddingLeft: '40px' }}
                    value={pesquisa}
                    onChange={(e) => setPesquisa(e.target.value)}
                    placeholder="Pesquisar serviço por nome..."
                />
            </div>

            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Duração</th>
                            <th>Preço</th>
                            <th style={{ width: '120px' }}>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {servicosFiltrados.map((servico) => (
                            <tr key={servico.id}>
                                <td>{servico.nome}</td>
                                <td>{servico.duracao} min</td>
                                <td>
                                    {Number(servico.preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </td>
                                <td>
                                    <div className="actions-cell">
                                        <button 
                                            className="icon-btn" 
                                            title="Editar"
                                            onClick={() => handleOpenModal(servico)}
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button 
                                            className="icon-btn danger" 
                                            title="Excluir"
                                            onClick={() => {
                                                if(window.confirm("Deseja realmente excluir este serviço?")) {
                                                    excluirServico(servico.id);
                                                }
                                            }}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {servicosFiltrados.length === 0 && (
                            <tr>
                                <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                                    Nenhum serviço encontrado.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Modal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
                title={servicoEditando ? "Editar Serviço" : "Novo Serviço"}
            >
                <form onSubmit={handleSave}>
                    <div className="form-group">
                        <label>Nome do Serviço *</label>
                        <input
                            className="input-field"
                            type="text"
                            placeholder="Ex: Corte Feminino"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Duração (minutos) *</label>
                        <input
                            className="input-field"
                            type="number"
                            placeholder="Ex: 60"
                            value={duracao}
                            onChange={(e) => setDuracao(e.target.value)}
                            required
                            min="1"
                        />
                    </div>

                    <div className="form-group">
                        <label>Preço (R$) *</label>
                        <input
                            className="input-field"
                            type="number"
                            placeholder="Ex: 80.00"
                            value={preco}
                            onChange={(e) => setPreco(e.target.value)}
                            required
                            min="0"
                            step="0.01"
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
                        <button type="button" className="btn" onClick={() => setIsModalOpen(false)}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn btn-primary">
                            {servicoEditando ? "Salvar Alterações" : "Cadastrar"}
                        </button>
                    </div>
                </form>
            </Modal>

        </Layout>
    );
}