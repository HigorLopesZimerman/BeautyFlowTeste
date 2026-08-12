from flask import Blueprint, jsonify, request
from database import conectar

relatorios_bp = Blueprint("relatorios", __name__)

@relatorios_bp.route("/relatorios", methods=["GET"])
def relatorios():
    inicio = request.args.get("inicio")
    fim = request.args.get("fim")

    conexao = conectar()

    # Construir condições de data se fornecidas
    condicao_agendamento = ""
    condicao_pagamento = ""
    params = []
    
    if inicio and fim:
        condicao_agendamento = " WHERE a.data BETWEEN ? AND ? "
        condicao_pagamento = " WHERE data_pagamento BETWEEN ? AND ? "
        params = [inicio, fim]

    # Função auxiliar para queries com data (agendamentos)
    def query_agendamento(base_query, extra_cond=""):
        where_clause = condicao_agendamento
        if extra_cond:
            where_clause = (where_clause + " AND " + extra_cond) if where_clause else (" WHERE " + extra_cond)
        return conexao.execute(base_query + where_clause, params).fetchone()

    # Função auxiliar para queries com data (pagamentos)
    def query_pagamento(base_query, extra_cond=""):
        where_clause = condicao_pagamento
        if extra_cond:
            where_clause = (where_clause + " AND " + extra_cond) if where_clause else (" WHERE " + extra_cond)
        return conexao.execute(base_query + where_clause, params).fetchone()

    # Serviço mais realizado
    servico_mais_realizado = conexao.execute(f"""
        SELECT s.nome, COUNT(*) AS quantidade
        FROM agendamentos a
        JOIN servicos s ON a.servico_id = s.id
        {condicao_agendamento}
        GROUP BY s.id
        ORDER BY quantidade DESC
        LIMIT 1
    """, params).fetchone()

    # Cliente frequente
    cliente_frequente = conexao.execute(f"""
        SELECT c.nome, COUNT(*) AS quantidade
        FROM agendamentos a
        JOIN clientes c ON a.cliente_id = c.id
        {condicao_agendamento}
        GROUP BY c.id
        ORDER BY quantidade DESC
        LIMIT 1
    """, params).fetchone()

    # Funcionário destaque
    funcionario_destaque = conexao.execute(f"""
        SELECT f.nome, COUNT(*) AS quantidade
        FROM agendamentos a
        JOIN funcionarios f ON a.funcionario_id = f.id
        {condicao_agendamento}
        GROUP BY f.id
        ORDER BY quantidade DESC
        LIMIT 1
    """, params).fetchone()

    # Totais
    total_agendamentos = query_agendamento("SELECT COUNT(*) FROM agendamentos a")[0]
    agendamentos_concluidos = query_agendamento("SELECT COUNT(*) FROM agendamentos a", "LOWER(a.status) = 'concluido'")[0]
    agendamentos_cancelados = query_agendamento("SELECT COUNT(*) FROM agendamentos a", "LOWER(a.status) = 'cancelado'")[0]

    pagamentos_pendentes = query_pagamento("SELECT COUNT(*) FROM pagamentos", "LOWER(status) = 'pendente'")[0]
    
    valor_pendente_row = query_pagamento("SELECT SUM(valor) FROM pagamentos", "LOWER(status) = 'pendente'")
    valor_pendente = valor_pendente_row[0] if valor_pendente_row[0] else 0

    faturamento_row = query_pagamento("SELECT SUM(valor) FROM pagamentos", "LOWER(status) = 'pago'")
    faturamento = faturamento_row[0] if faturamento_row[0] else 0

    conexao.close()

    return jsonify({
        "servico": dict(servico_mais_realizado) if servico_mais_realizado else None,
        "cliente": dict(cliente_frequente) if cliente_frequente else None,
        "funcionario": dict(funcionario_destaque) if funcionario_destaque else None,
        "total_agendamentos": total_agendamentos,
        "agendamentos_concluidos": agendamentos_concluidos,
        "agendamentos_cancelados": agendamentos_cancelados,
        "pagamentos_pendentes": pagamentos_pendentes,
        "valor_pendente": valor_pendente,
        "faturamento": faturamento
    })