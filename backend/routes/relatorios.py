from flask import Blueprint, jsonify, request
from database import conectar

relatorios_bp = Blueprint("relatorios", __name__)

@relatorios_bp.route("/relatorios", methods=["GET"])
def relatorios():
    
    conexao = conectar()
    
    
    servico_mais_realizado = conexao.execute("""
        SELECT
            s.nome,
            COUNT(*) AS quantidade

        FROM agendamentos a

        JOIN servicos s
            ON a.servico_id = s.id

        GROUP BY s.id

        ORDER BY quantidade DESC

        LIMIT 1
    """).fetchone()
    
    
    cliente_frequente = conexao.execute("""
        SELECT
            c.nome,
            COUNT(*) AS quantidade

        FROM agendamentos a

        JOIN clientes c
            ON a.cliente_id = c.id

        GROUP BY c.id

        ORDER BY quantidade DESC

        LIMIT 1
    """).fetchone()
    
    
    funcionario_destaque = conexao.execute("""
        SELECT
            f.nome,
            COUNT(*) AS quantidade

        FROM agendamentos a

        JOIN funcionarios f
            ON a.funcionario_id = f.id

        GROUP BY f.id

        ORDER BY quantidade DESC

        LIMIT 1
    """).fetchone()

    total_agendamentos = conexao.execute("""
        SELECT COUNT(*)
        FROM agendamentos
    """).fetchone()[0]

    agendamentos_concluidos = conexao.execute("""
        SELECT COUNT(*)
        FROM agendamentos
        WHERE status = 'concluido'
    """).fetchone()[0]

    agendamentos_cancelados = conexao.execute("""
        SELECT COUNT(*)
        FROM agendamentos
        WHERE status = 'cancelado'
    """).fetchone()[0]

    pagamentos_pendentes = conexao.execute("""
        SELECT COUNT(*)
        FROM pagamentos
        WHERE status = 'Pendente'
    """).fetchone()[0]

    valor_pendente = conexao.execute("""
        SELECT SUM(valor)
        FROM pagamentos
        WHERE status = 'Pendente'
    """).fetchone()[0]

    if valor_pendente is None:
        valor_pendente = 0



    return jsonify({

        "servico": dict(servico_mais_realizado),

        "cliente": dict(cliente_frequente),

        "funcionario": dict(funcionario_destaque),

        "total_agendamentos": total_agendamentos,

        "agendamentos_concluidos": agendamentos_concluidos,

        "agendamentos_cancelados": agendamentos_cancelados,

        "pagamentos_pendentes": pagamentos_pendentes,

        "valor_pendente": valor_pendente

    })
    
    
    
    
    
    conexao.close()

    return jsonify({

        "servico": dict(servico_mais_realizado),

        "cliente": dict(cliente_frequente),

        "funcionario": dict(funcionario_destaque)

    })



@relatorios_bp.route("/relatorios/faturamento", methods=["GET"])
def faturamento_periodo():

    inicio = request.args.get("inicio")
    fim = request.args.get("fim")

    if not inicio or not fim:
        return jsonify({
            "erro": "Informe as datas."
        }), 400

    conexao = conectar()

    faturamento = conexao.execute("""
        SELECT SUM(valor)
        FROM pagamentos
        WHERE status = 'Pago'
        AND data_pagamento BETWEEN ? AND ?
    """, (inicio, fim)).fetchone()[0]

    if faturamento is None:
        faturamento = 0

    conexao.close()

    return jsonify({
        "inicio": inicio,
        "fim": fim,
        "faturamento": faturamento
    })