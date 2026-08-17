from flask import Blueprint, jsonify, request
from database import conectar
from routes.auth import token_required

dashboard_bp = Blueprint("dashboard", __name__)


@dashboard_bp.route("/dashboard", methods=["GET"])
@token_required
def dashboard(usuario_id):
    
    conexao = conectar()
    
    total_clientes = conexao.execute("""
        SELECT COUNT(*)
        FROM clientes WHERE usuario_id = ?
    """, (usuario_id,)).fetchone()[0]
    
    total_funcionarios = conexao.execute("""
    SELECT COUNT(*)
    FROM funcionarios WHERE usuario_id = ?
    """, (usuario_id,)).fetchone()[0]
    
    total_servicos = conexao.execute("""
    SELECT COUNT(*)
    FROM servicos WHERE usuario_id = ?
    """, (usuario_id,)).fetchone()[0]
    
    total_agendamentos = conexao.execute("""
    SELECT COUNT(*)
    FROM agendamentos WHERE usuario_id = ?
    """, (usuario_id,)).fetchone()[0]
    
    total_pagamentos = conexao.execute("""
    SELECT COUNT(*)
    FROM pagamentos WHERE usuario_id = ?
    """, (usuario_id,)).fetchone()[0]
    
    faturamento = conexao.execute("""
        SELECT SUM(valor)
        FROM pagamentos
        WHERE LOWER(status) = 'pago' AND usuario_id = ?
        """, (usuario_id,)).fetchone()[0]
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

        WHERE a.data = DATE('now') AND a.usuario_id = ?

        ORDER BY a.hora
    """, (usuario_id,)).fetchall()      
    
    
    pagamentos_pendentes = conexao.execute("""
        SELECT COUNT(*)
        FROM pagamentos
        WHERE LOWER(status) = 'pendente' AND usuario_id = ?
    """, (usuario_id,)).fetchone()[0]
    
    
    valor_pendente = conexao.execute("""
        SELECT SUM(valor)
        FROM pagamentos
        WHERE LOWER(status) = 'pendente' AND usuario_id = ?
    """, (usuario_id,)).fetchone()[0]

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

        WHERE a.status = 'agendado' AND a.usuario_id = ?

        ORDER BY a.data, a.hora

        LIMIT 1
    """, (usuario_id,)).fetchone()
    
        
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
@token_required
def pagamentos_pendentes(usuario_id):

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
            
        WHERE LOWER(p.status) = 'pendente' AND p.usuario_id = ?
        
        ORDER BY p.data_pagamento
    """, (usuario_id,)).fetchall()
    
    conexao.close()
    
    return jsonify([
        dict(pagamento)
        for pagamento in pagamentos
    ])
    
    
@dashboard_bp.route("/dashboard/faturamento", methods = ["GET"])
@token_required
def faturamento_periodo(usuario_id):
    
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
        AND usuario_id = ?
    """, (
        inicio,
        fim,
        usuario_id
    )).fetchone()[0]    
    
    
    if faturamento is None:
        faturamento = 0
        
    conexao.close()
    
    return jsonify({
        "inicio": inicio,
        "fim": fim,
        "faturamento": faturamento
    })