import React from 'react';
import { Phone, Calendar, User, Scissors, MessageCircle, FileText } from 'lucide-react';

export default function AgendamentoActionModal({ agendamento, onClose, onStatusChange, onVerComanda }) {
    if (!agendamento) return null;

    const handleWhatsApp = () => {
        const tel = agendamento.telefone_cliente?.replace(/\D/g, '') || '';
        const msg = encodeURIComponent(`Olá ${agendamento.cliente}, passando para confirmar seu horário hoje às ${agendamento.hora} para ${agendamento.servico}!`);
        window.open(`https://wa.me/55${tel}?text=${msg}`, '_blank');
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '400px' }}>
                <div className="modal-header">
                    <h2>Detalhes do Agendamento</h2>
                    <button className="btn-close" onClick={onClose}>&times;</button>
                </div>

                <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.2rem', fontWeight: 'bold' }}>
                        <User size={24} className="text-primary" /> {agendamento.cliente}
                    </div>
                    {agendamento.telefone_cliente && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)' }}>
                            <Phone size={18} /> {agendamento.telefone_cliente}
                        </div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Calendar size={18} /> {agendamento.data || 'Hoje'} às {agendamento.hora}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Scissors size={18} /> {agendamento.servico}
                    </div>
                    {agendamento.cliente_nota && (
                        <div style={{ background: 'var(--bg-app)', padding: '10px', borderRadius: '8px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FileText size={16} /> {agendamento.cliente_nota}
                        </div>
                    )}

                    <button 
                        className="btn" 
                        style={{ background: '#25D366', color: 'white', display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '10px' }}
                        onClick={handleWhatsApp}
                    >
                        <MessageCircle size={20} /> Compartilhar via WhatsApp
                    </button>

                    <div style={{ marginTop: '1rem' }}>
                        <p style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>Alterar Status:</p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                            <button 
                                className={`btn ${agendamento.status === 'agendado' ? 'btn-primary' : ''}`}
                                onClick={() => onStatusChange('agendado')}
                            >Agendado</button>
                            <button 
                                className={`btn ${agendamento.status === 'confirmado' ? 'btn-primary' : ''}`}
                                onClick={() => onStatusChange('confirmado')}
                            >Confirmado</button>
                            <button 
                                className={`btn ${agendamento.status === 'cancelado' ? 'btn-danger' : ''}`}
                                onClick={() => onStatusChange('cancelado')}
                            >Cancelado</button>
                            <button 
                                className={`btn ${agendamento.status === 'concluido' ? 'btn-success' : ''}`}
                                onClick={() => onStatusChange('concluido')}
                            >Finalizado</button>
                        </div>
                    </div>

                </div>

                <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
                    <button className="btn" onClick={onClose}>Voltar</button>
                    <button className="btn btn-primary" onClick={onVerComanda}>Ver Comanda</button>
                </div>
            </div>
        </div>
    );
}
