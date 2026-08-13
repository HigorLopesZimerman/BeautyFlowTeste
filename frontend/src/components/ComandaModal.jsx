import React, { useState } from 'react';
import { User, Scissors, DollarSign } from 'lucide-react';
import { formatCurrency } from '../utils/masks';

export default function ComandaModal({ agendamento, onClose, onFecharComanda }) {
    if (!agendamento) return null;

    const [observacao, setObservacao] = useState("");
    const [valorEditado, setValorEditado] = useState(agendamento.preco || 0);

    const handleFechar = () => {
        onFecharComanda({
            valor: valorEditado,
            observacao: observacao
        });
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '400px' }}>
                <div className="modal-header">
                    <h2>Comanda</h2>
                    <button className="btn-close" onClick={onClose}>&times;</button>
                </div>

                <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.2rem', fontWeight: 'bold', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                        <User size={24} className="text-primary" /> {agendamento.cliente}
                    </div>

                    <div style={{ background: 'var(--bg-app)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                        <p style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>Item da Comanda:</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Scissors size={18} /> {agendamento.servico}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <DollarSign size={16} />
                                <input 
                                    type="number" 
                                    className="input-field" 
                                    value={valorEditado} 
                                    onChange={(e) => setValorEditado(e.target.value)}
                                    style={{ width: '80px', padding: '4px 8px' }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-group" style={{ marginTop: '0.5rem' }}>
                        <label>Observação (Opcional)</label>
                        <textarea 
                            className="input-field" 
                            rows="3"
                            value={observacao}
                            onChange={(e) => setObservacao(e.target.value)}
                            placeholder="Anotações sobre este atendimento..."
                        ></textarea>
                    </div>
                </div>

                <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', alignItems: 'center' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                        Total: {formatCurrency(Number(valorEditado))}
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button className="btn" onClick={onClose}>Manter aberta</button>
                        <button className="btn btn-primary" onClick={handleFechar} style={{ background: 'var(--success)', borderColor: 'var(--success)' }}>
                            Fechar comanda
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
