import { useState } from "react";
import { usePagamentos } from "../hooks/usePagamentos";
import { Search, Plus, Edit2, Trash2 } from "lucide-react";
import Layout from "../components/Layout";
import Modal from "../components/Modal";
import ConfirmModal from "../components/ConfirmModal";
import ErrorAlert from "../components/ErrorAlert";
import { formatCurrency } from "../utils/masks";

export default function Pagamentos() {
    const {
        agendamentos,
        agendamentoId, setAgendamentoId,
        valor, setValor,
        formaPagamento, setFormaPagamento,
        status, setStatus,
        dataPagamento, setDataPagamento,
        pagamentoEditando,
        pesquisa, setPesquisa,
        pagamentosFiltrados,
        cadastrarPagamento,
        excluirPagamento,
        alterarStatusPagamento,
        editarPagamento
    } = usePagamentos();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [erroAPI, setErroAPI] = useState("");

    const handleOpenModal = (pagamento = null) => {
        setErroAPI("");
        if (pagamento) {
            editarPagamento(pagamento);
        } else {
            setAgendamentoId("");
            setValor("");
            setFormaPagamento("");
            setStatus("pendente");
            setDataPagamento(new Date().toISOString().split("T")[0]);
            editarPagamento(null);
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setErroAPI("");
        const resultado = await cadastrarPagamento();
        if (resultado?.success) {
            setIsModalOpen(false);
        } else {
            setErroAPI(resultado?.error || "Erro ao salvar.");
        }
    };

    return (
        <Layout>


            <div style={{ position: 'relative', marginBottom: '1.5rem', maxWidth: '400px' }}>
                <Search size={20} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
                <input
                    className="input-field"
                    style={{ paddingLeft: '40px' }}
                    value={pesquisa}
                    onChange={(e) => setPesquisa(e.target.value)}
                    placeholder="Pesquisar pagamento..."
                />
            </div>

            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Data</th>
                            <th>Cliente</th>
                            <th>Serviço</th>
                            <th>Forma</th>
                            <th>Valor</th>
                            <th>Status</th>
                            <th style={{ width: '120px' }}>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pagamentosFiltrados.map((pagamento) => (
                            <tr key={pagamento.id}>
                                <td>{pagamento.data_pagamento.split('-').reverse().join('/')}</td>
                                <td>{pagamento.cliente}</td>
                                <td>{pagamento.servico}</td>
                                <td>{pagamento.forma_pagamento}</td>
                                <td>{formatCurrency(pagamento.valor)}</td>
                                <td>
                                    <select
                                        className={`status-select status-${pagamento.status}`}
                                        value={pagamento.status}
                                        onChange={(e) => alterarStatusPagamento(pagamento.id, e.target.value)}
                                    >
                                        <option value="pendente">Pendente</option>
                                        <option value="pago">Pago</option>
                                        <option value="cancelado">Cancelado</option>
                                    </select>
                                </td>
                                <td>
                                    <div className="actions-cell">
                                        <button
                                            className="icon-btn"
                                            title="Editar"
                                            onClick={() => handleOpenModal(pagamento)}
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            className="icon-btn danger"
                                            title="Excluir"
                                            onClick={() => {
                                                setItemToDelete(pagamento.id);
                                                setIsConfirmOpen(true);
                                            }}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {pagamentosFiltrados.length === 0 && (
                            <tr>
                                <td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                                    Nenhum pagamento encontrado.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={pagamentoEditando ? "Editar Pagamento" : "Novo Pagamento"}
            >
                <ErrorAlert message={erroAPI} />
                <form onSubmit={handleSave}>

                    <div className="form-group">
                        <label>Agendamento vinculado *</label>
                        <select
                            className="input-field"
                            value={agendamentoId}
                            onChange={(e) => setAgendamentoId(e.target.value)}
                            required
                        >
                            <option value="">Selecione um agendamento...</option>
                            {agendamentos.map((a) => (
                                <option key={a.id} value={a.id}>
                                    {a.data.split('-').reverse().join('/')} - {a.cliente} ({a.servico})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Data do Pagamento *</label>
                            <input
                                className="input-field"
                                type="date"
                                value={dataPagamento}
                                onChange={(e) => setDataPagamento(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Valor (R$) *</label>
                            <input
                                className="input-field"
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={valor}
                                onChange={(e) => setValor(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Forma de Pagamento *</label>
                            <select
                                className="input-field"
                                value={formaPagamento}
                                onChange={(e) => setFormaPagamento(e.target.value)}
                                required
                            >
                                <option value="">Selecione...</option>
                                <option value="Dinheiro">Dinheiro</option>
                                <option value="Pix">Pix</option>
                                <option value="Cartão de Crédito">Cartão de Crédito</option>
                                <option value="Cartão de Débito">Cartão de Débito</option>
                            </select>
                        </div>

                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Status *</label>
                            <select
                                className="input-field"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                required
                            >
                                <option value="pendente">Pendente</option>
                                <option value="pago">Pago</option>
                                <option value="cancelado">Cancelado</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
                        <button type="button" className="btn" onClick={() => setIsModalOpen(false)}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn btn-primary">
                            {pagamentoEditando ? "Salvar Alterações" : "Cadastrar"}
                        </button>
                    </div>
                </form>
            </Modal>

            <ConfirmModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={() => excluirPagamento(itemToDelete)}
                title="Excluir Pagamento"
                message="Deseja realmente excluir este pagamento? Esta ação não pode ser desfeita."
            />

        </Layout>
    );
}