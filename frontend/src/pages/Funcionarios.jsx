import { useState } from "react";
import { useFuncionarios } from "../hooks/useFuncionarios";
import { Search, Plus, Edit2, Trash2 } from "lucide-react";
import Layout from "../components/Layout";
import Modal from "../components/Modal";
import { formatPhone } from "../utils/masks";

export default function Funcionarios() {
    const {
        nome, setNome,
        funcao, setFuncao,
        telefone, setTelefone,
        email, setEmail,
        funcionarioEditando,
        pesquisa, setPesquisa,
        funcionariosFiltrados,
        cadastrarFuncionario,
        excluirFuncionario,
        editarFuncionario
    } = useFuncionarios();

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = (funcionario = null) => {
        if (funcionario) {
            editarFuncionario(funcionario);
        } else {
            // Limpa form para novo cadastro
            setNome("");
            setFuncao("");
            setTelefone("");
            setEmail("");
            editarFuncionario(null); // Reseta estado de edição
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        await cadastrarFuncionario();
        setIsModalOpen(false);
    };

    return (
        <Layout>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ margin: 0 }}>Funcionários</h1>
                <button className="btn btn-primary" onClick={() => handleOpenModal()}>
                    <Plus size={20} />
                    Novo Funcionário
                </button>
            </div>

            <div style={{ position: 'relative', marginBottom: '1.5rem', maxWidth: '400px' }}>
                <Search size={20} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
                <input
                    className="input-field"
                    style={{ paddingLeft: '40px' }}
                    value={pesquisa}
                    onChange={(e) => setPesquisa(e.target.value)}
                    placeholder="Pesquisar funcionário por nome..."
                />
            </div>

            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Função</th>
                            <th>Telefone</th>
                            <th>Email</th>
                            <th style={{ width: '120px' }}>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {funcionariosFiltrados.map((funcionario) => (
                            <tr key={funcionario.id}>
                                <td>{funcionario.nome}</td>
                                <td>{funcionario.funcao}</td>
                                <td>{funcionario.telefone}</td>
                                <td>{funcionario.email || "-"}</td>
                                <td>
                                    <div className="actions-cell">
                                        <button 
                                            className="icon-btn" 
                                            title="Editar"
                                            onClick={() => handleOpenModal(funcionario)}
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button 
                                            className="icon-btn danger" 
                                            title="Excluir"
                                            onClick={() => {
                                                if(window.confirm("Deseja realmente excluir este funcionário?")) {
                                                    excluirFuncionario(funcionario.id);
                                                }
                                            }}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {funcionariosFiltrados.length === 0 && (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                                    Nenhum funcionário encontrado.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Modal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
                title={funcionarioEditando ? "Editar Funcionário" : "Novo Funcionário"}
            >
                <form onSubmit={handleSave}>
                    <div className="form-group">
                        <label>Nome Completo *</label>
                        <input
                            className="input-field"
                            type="text"
                            placeholder="Ex: Carlos Souza"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Função *</label>
                        <input
                            className="input-field"
                            type="text"
                            placeholder="Ex: Cabeleireiro"
                            value={funcao}
                            onChange={(e) => setFuncao(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Telefone *</label>
                        <input
                            className="input-field"
                            type="tel"
                            placeholder="Ex: (11) 99999-9999"
                            value={telefone}
                            onChange={(e) => setTelefone(formatPhone(e.target.value))}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input
                            className="input-field"
                            type="email"
                            placeholder="Ex: carlos@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
                        <button type="button" className="btn" onClick={() => setIsModalOpen(false)}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn btn-primary">
                            {funcionarioEditando ? "Salvar Alterações" : "Cadastrar"}
                        </button>
                    </div>
                </form>
            </Modal>

        </Layout>
    );
}