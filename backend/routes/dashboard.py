from flask import Blueprint, jsonify, request
from database import conectar

dashboard_bp = Blueprint("dashboard", __name__)


@dashboard_bp.route("/dashboard", methods=["GET"])
def dashboard():
    
    conexao = conectar()
    
    total_clientes = conexao.execute("""
        SELECT COUNT(*)
        FROM clientes
    """).fetchone()[0]
    
    total_funcionarios = conexao.execute("""
    SELECT COUNT(*)
    FROM funcionarios
    """).fetchone()[0]
    
    total_servicos = conexao.execute("""
    SELECT COUNT(*)
    FROM servicos
    """).fetchone()[0]
    
    total_agendamentos = conexao.execute("""
    SELECT COUNT(*)
    FROM agendamentos
    """).fetchone()[0]
    
    total_pagamentos = conexao.execute("""
    SELECT COUNT(*)
    FROM pagamentos
    """).fetchone()[0]
    
    faturamento = conexao.execute("""
        SELECT SUM(valor)
        FROM pagamentos
        WHERE LOWER(status) = 'pago'
        """).fetchone()[0]
    if faturamento is None:
        faturamento = 0


    agenda_hoje = conexao.execute("""
        SELECT
            a.id,
            a.status,
            a.hora,
            c.nome AS cliente,
            c.telefone AS telefone_cliente,
            c.nota AS cliente_nota,
            s.nome AS servico,
            s.preco AS preco

        FROM agendamentos a

        JOIN clientes c
            ON a.cliente_id = c.id

        JOIN servicos s
            ON a.servico_id = s.id

        WHERE a.data = DATE('now')

        ORDER BY a.hora
    """).fetchall()      
    
    
    pagamentos_pendentes = conexao.execute("""
        SELECT COUNT(*)
        FROM pagamentos
        WHERE LOWER(status) = 'pendente'
    """).fetchone()[0]
    
    
    valor_pendente = conexao.execute("""
        SELECT SUM(valor)
        FROM pagamentos
        WHERE LOWER(status) = 'pendente'
    """).fetchone()[0]

    if valor_pendente is None:
        valor_pendente = 0
        
        
    proximo_atendimento = conexao.execute("""
        SELECT
            a.id,
            a.status,
            a.data,
            a.hora,
            c.nome AS cliente,
            c.telefone AS telefone_cliente,
            c.nota AS cliente_nota,
            s.nome AS servico,
            s.preco AS preco

        FROM agendamentos a

        JOIN clientes c
            ON a.cliente_id = c.id

        JOIN servicos s
            ON a.servico_id = s.id

        WHERE a.status = 'agendado'

        ORDER BY a.data, a.hora

        LIMIT 1
    """).fetchone()
    
        
    conexao.close()
    
    return jsonify({
    "clientes": total_clientes,
    "funcionarios": total_funcionarios,
    "servicos": total_servicos,
    "agendamentos": total_agendamentos,
    "pagamentos": total_pagamentos,
    "faturamento": faturamento,
    "agenda_hoje": [
        dict(agendamento)
        for agendamento in agenda_hoje
    ],
    "pagamentos_pendentes": pagamentos_pendentes,
    "valor_pendente": valor_pendente,
    "proximo_atendimento": (
        dict(proximo_atendimento)
        if proximo_atendimento
        else None
    )
    })
    

@dashboard_bp.route("/dashboard/pagamentos-pendentes", methods=["GET"])
def pagamentos_pendentes():

    conexao = conectar()
    
    pagamentos = conexao.execute("""
        SELECT
            p.id,
            c.nome AS cliente,
            s.nome AS servico,
            p.valor,
            p.forma_pagamento,
            p.data_pagamento
            
        
        FROM pagamentos p
        
        JOIN agendamentos a
            ON p.agendamento_id = a.id
            
        JOIN clientes c
            ON a.cliente_id
            
        JOIN servicos s
            ON a.servico_id = s.id
            
        WHERE LOWER(p.status) = 'pendente'
        
        ORDER BY p.data_pagamento
    """).fetchall()
    
    
    
    
    
    conexao.close()
    
    return jsonify([
        dict(pagamento)
        for pagamento in pagamentos
    ])
    
    
@dashboard_bp.route("/dashboard/faturamento", methods = ["GET"])
def faturamento_periodo():
    
    inicio = request.args.get("inicio")
    fim = request.args.get("fim")
    
    if not inicio or not fim:
        return jsonify({
            "erro": "Informe as datas de início e fim"
        }), 400
        
    
    
    conexao = conectar()
    
    
    faturamento = conexao.execute("""
        SELECT SUM(valor)
        FROM pagamentos
        WHERE status = 'pago'
        AND data_pagamento BETWEEN ? AND ?
    """, (
        inicio,
        fim
    )).fetchone()[0]    
    
    
    if faturamento is None:
        faturamento = 0
        
    conexao.close()
    
    return jsonify({
        "inicio": inicio,
        "fim": fim,
        "faturamento": faturamento
    })