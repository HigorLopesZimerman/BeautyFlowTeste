import { useState } from "react";
import { useClientes } from "../hooks/useClientes";
import { Search, Plus, Edit2, Trash2 } from "lucide-react";
import Layout from "../components/Layout";
import Modal from "../components/Modal";
import { formatPhone } from "../utils/masks";

export default function Clientes() {
    const {
        nome, setNome,
        telefone, setTelefone,
        email, setEmail,
        nota, setNota,
        clienteEditando,
        pesquisa, setPesquisa,
        clientesFiltrados,
        cadastrarCliente,
        excluirCliente,
        editarCliente
    } = useClientes();

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = (cliente = null) => {
        if (cliente) {
            editarCliente(cliente);
        } else {
            // Limpa form para novo cadastro
            setNome("");
            setTelefone("");
            setEmail("");
            setNota("");
            editarCliente(null); // Reseta o estado de edição no hook
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        await cadastrarCliente();
        setIsModalOpen(false);
    };

    return (
        <Layout>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ margin: 0 }}>Clientes</h1>
                <button className="btn btn-primary" onClick={() => handleOpenModal()}>
                    <Plus size={20} />
                    Novo Cliente
                </button>
            </div>

            <div style={{ position: 'relative', marginBottom: '1.5rem', maxWidth: '400px' }}>
                <Search size={20} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
                <input
                    className="input-field"
                    style={{ paddingLeft: '40px' }}
                    value={pesquisa}
                    onChange={(e) => setPesquisa(e.target.value)}
                    placeholder="Pesquisar cliente por nome..."
                />
            </div>

            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Telefone</th>
                            <th>Email</th>
                            <th>Nota</th>
                            <th style={{ width: '120px' }}>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clientesFiltrados.map((cliente) => (
                            <tr key={cliente.id}>
                                <td>{cliente.nome}</td>
                                <td>{cliente.telefone}</td>
                                <td>{cliente.email}</td>
                                <td style={{ maxWidth: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={cliente.nota}>
                                    {cliente.nota || "-"}
                                </td>
                                <td>
                                    <div className="actions-cell">
                                        <button 
                                            className="icon-btn" 
                                            title="Editar"
                                            onClick={() => handleOpenModal(cliente)}
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button 
                                            className="icon-btn danger" 
                                            title="Excluir"
                                            onClick={() => {
                                                if(window.confirm("Deseja realmente excluir este cliente?")) {
                                                    excluirCliente(cliente.id);
                                                }
                                            }}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {clientesFiltrados.length === 0 && (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                                    Nenhum cliente encontrado.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Modal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
                title={clienteEditando ? "Editar Cliente" : "Novo Cliente"}
            >
                <form onSubmit={handleSave}>
                    <div className="form-group">
                        <label>Nome Completo *</label>
                        <input
                            className="input-field"
                            type="text"
                            placeholder="Ex: Maria Silva"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
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
                            placeholder="Ex: maria@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Nota / Observação</label>
                        <input
                            className="input-field"
                            type="text"
                            placeholder="Ex: Irmã da Joana, prefere horário da tarde"
                            value={nota}
                            onChange={(e) => setNota(e.target.value)}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
                        <button type="button" className="btn" onClick={() => setIsModalOpen(false)}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn btn-primary">
                            {clienteEditando ? "Salvar Alterações" : "Cadastrar"}
                        </button>
                    </div>
                </form>
            </Modal>

        </Layout>
    );
}