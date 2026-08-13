import { useRelatorios } from "../hooks/useRelatorios";
import Layout from "../components/Layout";
import Card from "../components/Card";
import { formatCurrency } from "../utils/masks";
import { TrendingUp, Calendar, XCircle, CreditCard, DollarSign, Scissors, User, Briefcase } from "lucide-react";

export default function Relatorios() {
    const {
        dados,
        inicio, setInicio,
        fim, setFim,
        consultarPeriodo,
        limparFiltro
    } = useRelatorios();

    if (!dados) {
        return (
            <Layout>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                    <h2 style={{ color: 'var(--text-muted)' }}>Carregando dados de relatórios...</h2>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ margin: 0 }}>Relatórios e Desempenho</h1>
            </div>

            <div style={{ 
                background: 'var(--bg-surface)', 
                padding: '1.5rem', 
                borderRadius: 'var(--radius-lg)', 
                boxShadow: 'var(--shadow-md)',
                marginBottom: '2.5rem',
                border: '1px solid var(--border-color)'
            }}>
                <h3 style={{ margin: '0 0 1rem 0' }}>Filtrar Período</h3>
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "flex-end" }}>
                    <div className="form-group" style={{ flex: 1, minWidth: '150px' }}>
                        <label>Data Início</label>
                        <input
                            className="input-field"
                            type="date"
                            value={inicio}
                            onChange={(e) => setInicio(e.target.value)}
                        />
                    </div>
                    <div className="form-group" style={{ flex: 1, minWidth: '150px' }}>
                        <label>Data Fim</label>
                        <input
                            className="input-field"
                            type="date"
                            value={fim}
                            onChange={(e) => setFim(e.target.value)}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn btn-primary" onClick={consultarPeriodo} style={{ padding: '0.8rem 1.5rem', height: 'max-content' }}>
                            Filtrar
                        </button>
                        <button className="btn" onClick={limparFiltro} style={{ padding: '0.8rem 1.5rem', height: 'max-content' }}>
                            Limpar
                        </button>
                    </div>
                </div>
            </div>

            <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-main)' }}>
                Visão Geral {inicio && fim ? "(Período Filtrado)" : "(Todo o Período)"}
            </h2>
            <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", 
                gap: "1.5rem" 
            }}>
                <Card titulo="Faturamento Confirmado" valor={formatCurrency(dados.faturamento)} icon={TrendingUp} colorClass="success" />
                <Card titulo="Agendamentos Realizados" valor={dados.total_agendamentos} icon={Calendar} colorClass="primary" />
                <Card titulo="Agendamentos Cancelados" valor={dados.agendamentos_cancelados} icon={XCircle} colorClass="danger" />
                <Card titulo="Pagamentos Pendentes" valor={dados.pagamentos_pendentes} icon={CreditCard} colorClass="warning" />
                <Card titulo="Valor Pendente Total" valor={formatCurrency(dados.valor_pendente)} icon={DollarSign} colorClass="warning" />
                
                {dados.servico && (
                    <Card titulo="Serviço Mais Realizado" valor={dados.servico.nome} icon={Scissors} colorClass="success" />
                )}
                {dados.cliente && (
                    <Card titulo="Cliente Mais Frequente" valor={dados.cliente.nome} icon={User} colorClass="text-main" />
                )}
                {dados.funcionario && (
                    <Card titulo="Funcionário Destaque" valor={dados.funcionario.nome} icon={Briefcase} colorClass="primary" />
                )}
            </div>
        </Layout>
    );
}