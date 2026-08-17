import { useDashboard } from "../hooks/useDashboard";
import Layout from "../components/Layout";
import Card from "../components/Card";
import { formatCurrency } from "../utils/masks";
import { Calendar, Clock, User, Scissors, MessageCircle, DollarSign, AlertCircle, CreditCard, Users, FileText, AlertTriangle } from "lucide-react";
import { useState } from "react";
import AgendamentoActionModal from "../components/AgendamentoActionModal";
import ComandaModal from "../components/ComandaModal";
import PagamentoModal from "../components/PagamentoModal";
import { updateAgendamentoStatus } from "../services/agendamentoService";
import { createPagamento } from "../services/pagamentoService";

export default function Dashboard() {
    const { dados, carregando, erro, proximoAgendamento, proximo, recarregarDashboard } = useDashboard();

    const [selectedAgendamento, setSelectedAgendamento] = useState(null);
    const [modalAberto, setModalAberto] = useState(null); // 'action', 'comanda', 'pagamento'
    const [comandaDados, setComandaDados] = useState(null);

    if (carregando) {
        return (
            <Layout>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                    <h2 style={{ color: 'var(--text-muted)' }}>Carregando dados do painel...</h2>
                </div>
            </Layout>
        );
    }

    if (erro) {
        return (
            <Layout>
                <h2 className="text-danger">{erro}</h2>
            </Layout>
        );
    }

    const agendaHoje = dados?.agenda_hoje || [];
    const proximoAtendimento = proximoAgendamento || proximo;

    const handleWhatsAppProximo = () => {
        if (!proximoAtendimento) return;
        const tel = proximoAtendimento.telefone_cliente?.replace(/\D/g, '') || '';
        const msg = encodeURIComponent(`Olá ${proximoAtendimento.cliente}, passando para confirmar seu horário hoje às ${proximoAtendimento.hora} para ${proximoAtendimento.servico}!`);
        window.open(`https://wa.me/55${tel}?text=${msg}`, '_blank');
    };

    const abrirActionModal = (agendamento) => {
        setSelectedAgendamento(agendamento);
        setModalAberto('action');
    };

    const handleStatusChange = async (novoStatus) => {
        try {
            await updateAgendamentoStatus(selectedAgendamento.id, novoStatus);
            setModalAberto(null);
            recarregarDashboard();
        } catch (error) {
            alert("Erro ao atualizar status.");
        }
    };

    const handleFecharComanda = (dadosComanda) => {
        setComandaDados(dadosComanda);
        setModalAberto('pagamento');
    };

    const handleConfirmarPagamento = async (formaPagamento) => {
        try {
            // 1. Criar o pagamento
            const hoje = new Date().toISOString().split('T')[0];
            await createPagamento({
                agendamento_id: selectedAgendamento.id,
                valor: comandaDados.valor,
                forma_pagamento: formaPagamento,
                status: 'pago',
                data_pagamento: hoje
            });

            // 2. Atualizar status do agendamento para concluído
            await updateAgendamentoStatus(selectedAgendamento.id, 'concluido');

            setModalAberto(null);
            recarregarDashboard();
            alert("Comanda fechada com sucesso!");
        } catch (error) {
            alert("Erro ao fechar comanda.");
        }
    };

    return (
        <Layout>
            <h1 style={{ margin: '0 0 2rem 0' }}>Dashboard Geral</h1>

            <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", 
                gap: "1.5rem" 
            }}>
                <Card titulo="Faturamento (Hoje)" valor={formatCurrency(dados.faturamento)} icon={DollarSign} colorClass="success" />
                <Card titulo="Valores Pendentes" valor={formatCurrency(dados.valor_pendente)} icon={AlertCircle} colorClass="warning" />
                <Card titulo="Agendamentos" valor={dados.agendamentos} icon={Calendar} colorClass="primary" />
                <Card titulo="Pagamentos" valor={dados.pagamentos} icon={CreditCard} colorClass="primary" />
                <Card titulo="Clientes Cadastrados" valor={dados.clientes} icon={Users} colorClass="text-main" />
                <Card titulo="Serviços Ativos" valor={dados.servicos} icon={Scissors} colorClass="text-main" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem', marginTop: '2.5rem' }}>
                
                {/* Painel do Próximo Atendimento */}
                <div 
                    className={proximoAtendimento?.status === 'agendado' ? 'pulse-alert' : ''}
                    style={{ 
                        background: 'var(--primary)', 
                        color: 'white', 
                        borderRadius: 'var(--radius-lg)', 
                        padding: '2rem',
                        boxShadow: 'var(--shadow-lg)',
                        position: 'relative'
                    }}
                >
                    <h2 style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '10px', margin: '0 0 1.5rem 0' }}>
                        <Clock size={24} /> Próximo Atendimento
                    </h2>
                    
                    {proximoAtendimento ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
                                {proximoAtendimento.hora}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.2rem' }}>
                                <User size={20} /> 
                                {proximoAtendimento.cliente}
                                {proximoAtendimento.cliente_nota && (
                                    <span style={{ fontSize: '0.9rem', background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '12px', marginLeft: '8px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                        <FileText size={14} /> {proximoAtendimento.cliente_nota}
                                    </span>
                                )}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem', opacity: 0.9 }}>
                                <Scissors size={18} /> {proximoAtendimento.servico}
                            </div>
                            
                            {proximoAtendimento.status === 'agendado' && (
                                <div style={{ 
                                    background: 'var(--danger)', 
                                    padding: '12px', 
                                    borderRadius: 'var(--radius-md)', 
                                    marginTop: '1rem',
                                    fontWeight: 'bold',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '10px'
                                }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><AlertTriangle size={18} /> Pendente de Confirmação! Entre em contato.</span>
                                    <button 
                                        className="btn" 
                                        style={{ background: '#25D366', color: 'white', display: 'flex', justifyContent: 'center', gap: '10px', border: 'none', padding: '8px' }}
                                        onClick={handleWhatsAppProximo}
                                    >
                                        <MessageCircle size={20} /> Enviar WhatsApp
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <p style={{ fontSize: '1.1rem', opacity: 0.8 }}>Nenhum atendimento próximo agendado para hoje.</p>
                    )}
                </div>

                {/* Agenda de Hoje */}
                <div style={{ 
                    background: 'var(--bg-surface)', 
                    borderRadius: 'var(--radius-lg)', 
                    padding: '2rem',
                    boxShadow: 'var(--shadow-md)',
                    border: '1px solid var(--border-color)'
                }}>
                    <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '0 0 1.5rem 0' }}>
                        <Calendar size={24} className="text-primary" /> Agenda de Hoje
                    </h2>

                    {agendaHoje.length === 0 ? (
                        <p style={{ color: 'var(--text-muted)' }}>Você não tem agendamentos para o dia de hoje.</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {agendaHoje.map((agendamento, index) => (
                                    <div 
                                        key={index} 
                                        onClick={() => abrirActionModal(agendamento)}
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            padding: "1rem",
                                            borderBottom: index < agendaHoje.length - 1 ? "1px solid var(--border-color)" : "none",
                                            cursor: "pointer",
                                            borderRadius: "var(--radius-md)",
                                            transition: "background 0.2s",
                                            background: "var(--bg-app)",
                                            marginBottom: "0.5rem"
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-surface)'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = 'var(--bg-app)'}
                                    >
                                    <div>
                                        <strong style={{ color: 'var(--primary)', fontSize: '1.1rem', display: 'block', marginBottom: '4px' }}>
                                            {agendamento.hora}
                                        </strong>
                                        <span style={{ fontWeight: '500' }}>{agendamento.cliente}</span>
                                        {agendamento.cliente_nota && (
                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <FileText size={14} /> {agendamento.cliente_nota}
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'right' }}>
                                        {agendamento.servico}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Retenção de Clientes (Diferencial) - Movido para fora do grid principal, design discreto */}
            {dados?.ausentes?.length > 0 && (
                <div style={{ 
                    marginTop: '2.5rem',
                    background: 'var(--bg-surface)', 
                    borderRadius: 'var(--radius-lg)', 
                    padding: '1.5rem',
                    boxShadow: 'var(--shadow-sm)',
                    border: '1px solid var(--border-color)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0, fontSize: '1.2rem', color: 'var(--text-main)' }}>
                            <AlertCircle size={20} className="text-primary" /> Retenção de Clientes
                        </h2>
                        <span style={{ fontSize: '0.8rem', background: 'var(--bg-app)', border: '1px solid var(--border-color)', color: 'var(--text-muted)', padding: '4px 10px', borderRadius: '12px' }}>
                            {dados.ausentes.length} ausentes
                        </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                        {dados.ausentes.map((cliente, index) => {
                            const telLimpo = cliente.telefone ? cliente.telefone.replace(/\D/g, '') : '';
                            const msg = encodeURIComponent(`Olá ${cliente.nome.split(' ')[0]}! Sentimos sua falta no BeautyFlow. Que tal agendar um novo horário com a gente para renovar o visual? 💜`);
                            const linkWhats = `https://wa.me/55${telLimpo}?text=${msg}`;
                            const dataFormatada = new Date(cliente.ultima_visita).toLocaleDateString('pt-BR');

                            return (
                                <div key={index} style={{
                                    background: 'var(--bg-app)',
                                    padding: '0.75rem 1rem',
                                    borderRadius: 'var(--radius-md)',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    border: '1px solid var(--border-color)'
                                }}>
                                    <div>
                                        <strong style={{ display: 'block', fontSize: '0.95rem', color: 'var(--text-main)' }}>{cliente.nome}</strong>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Última visita: {dataFormatada}</span>
                                    </div>
                                    <button 
                                        onClick={() => window.open(linkWhats, '_blank')}
                                        style={{ 
                                            background: 'transparent',
                                            color: '#25D366', 
                                            border: '1px solid #25D366', 
                                            padding: '6px', 
                                            borderRadius: '50%', 
                                            cursor: 'pointer', 
                                            display: 'flex', 
                                            justifyContent: 'center', 
                                            alignItems: 'center',
                                            transition: 'all 0.2s'
                                        }}
                                        onMouseEnter={(e) => { e.currentTarget.style.background = '#25D366'; e.currentTarget.style.color = 'white'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#25D366'; }}
                                        title="Enviar WhatsApp"
                                    >
                                        <MessageCircle size={18} />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {modalAberto === 'action' && (
                <AgendamentoActionModal
                    agendamento={selectedAgendamento}
                    onClose={() => setModalAberto(null)}
                    onStatusChange={handleStatusChange}
                    onVerComanda={() => setModalAberto('comanda')}
                />
            )}

            {modalAberto === 'comanda' && (
                <ComandaModal
                    agendamento={selectedAgendamento}
                    onClose={() => setModalAberto('action')}
                    onFecharComanda={handleFecharComanda}
                />
            )}

            {modalAberto === 'pagamento' && (
                <PagamentoModal
                    agendamento={selectedAgendamento}
                    valor={comandaDados?.valor}
                    onClose={() => setModalAberto('comanda')}
                    onConfirmarPagamento={handleConfirmarPagamento}
                />
            )}

        </Layout>
    );
}