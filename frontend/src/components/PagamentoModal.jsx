import React from 'react';
import { CreditCard, Wallet, Banknote, RefreshCcw } from 'lucide-react';

export default function PagamentoModal({ agendamento, valor, onClose, onConfirmarPagamento }) {
    if (!agendamento) return null;

    const metodos = [
        { id: 'pix', nome: 'Pix', icone: <RefreshCcw size={20} /> },
        { id: 'cartao_debito', nome: 'Cart. de débito', icone: <CreditCard size={20} /> },
        { id: 'cartao_credito', nome: 'Cart. de crédito', icone: <CreditCard size={20} /> },
        { id: 'dinheiro', nome: 'Dinheiro', icone: <Banknote size={20} /> },
        { id: 'fiado', nome: 'Fiado', icone: <Wallet size={20} /> },
    ];

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '400px' }}>
                <div className="modal-header">
                    <h2>Método de Pagamento</h2>
                    <button className="btn-close" onClick={onClose}>&times;</button>
                </div>

                <div className="modal-body">
                    <p style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
                        Selecione a forma de pagamento para fechar a conta de <strong>R$ {Number(valor).toFixed(2).replace('.', ',')}</strong>.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {metodos.map((metodo) => (
                            <button
                                key={metodo.id}
                                className="btn"
                                style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'space-between',
                                    padding: '1rem', 
                                    fontSize: '1.1rem',
                                    background: 'var(--bg-surface)',
                                    border: '1px solid var(--border-color)',
                                    textAlign: 'left'
                                }}
                                onClick={() => onConfirmarPagamento(metodo.nome)}
                            >
                                <span style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    {metodo.icone} {metodo.nome}
                                </span>
                                <span style={{ color: 'var(--text-muted)' }}>&gt;</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
