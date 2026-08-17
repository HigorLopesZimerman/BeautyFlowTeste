from flask import Blueprint, jsonify, request
from database import conectar
from routes.auth import token_required

pagamentos_bp = Blueprint("pagamentos", __name__)

@pagamentos_bp.route("/pagamentos", methods=["GET"])
@token_required
def listar_pagamentos(usuario_id):
    conexao = conectar()

    pagamentos = conexao.execute("""
        SELECT
            p.id,

            p.agendamento_id,

            c.nome AS cliente,
            f.nome AS funcionario,
            s.nome AS servico,

            p.valor,
            p.forma_pagamento,
            p.status,
            p.data_pagamento

        FROM pagamentos p

        JOIN agendamentos a
            ON p.agendamento_id = a.id

        JOIN clientes c
            ON a.cliente_id = c.id

        JOIN funcionarios f
            ON a.funcionario_id = f.id

        JOIN servicos s
            ON a.servico_id = s.id
            
        WHERE p.usuario_id = ?
    """, (usuario_id,)).fetchall()

    conexao.close()

    return jsonify([dict(pagamento) for pagamento in pagamentos])



@pagamentos_bp.route("/pagamentos", methods=["POST"])
@token_required
def cadastrar_pagamento(usuario_id):
    dados = request.get_json()

    agendamento_id = dados.get("agendamento_id")
    valor = dados.get("valor")
    forma_pagamento = dados.get("forma_pagamento")
    status = dados.get("status")
    data_pagamento = dados.get("data_pagamento")

    if not all([
        agendamento_id,
        valor,
        forma_pagamento,
        status,
        data_pagamento
    ]):
        return jsonify({
            "erro": "Todos os campos são obrigatórios."
        }), 400

    conexao = conectar()
    
        
    agendamento = conexao.execute("""
        SELECT id
        FROM agendamentos
        WHERE id = ? AND usuario_id = ?
    """, (agendamento_id, usuario_id)).fetchone()

    if not agendamento:
        conexao.close()
        return jsonify({
            "erro": "Agendamento não encontrado."
        }), 404
        
    
    
    conexao.execute("""
        INSERT INTO pagamentos (
            usuario_id,
            agendamento_id,
            valor,
            forma_pagamento,
            status,
            data_pagamento
        )
        VALUES (?, ?, ?, ?, ?, ?)
    """, (
        usuario_id,
        agendamento_id,
        valor,
        forma_pagamento,
        status,
        data_pagamento
    ))
    
    conexao.commit()
    conexao.close()
    
    return jsonify({
        "mensagem": "Pagamento cadastrado com sucesso!"
    }), 201

    
    
@pagamentos_bp.route("/pagamentos/<int:id>", methods=["PUT"])
@token_required
def editar_pagamento(usuario_id, id):
    dados = request.get_json()

    agendamento_id = dados.get("agendamento_id")
    valor = dados.get("valor")
    forma_pagamento = dados.get("forma_pagamento")
    status = dados.get("status")
    data_pagamento = dados.get("data_pagamento")

    if not all([
        agendamento_id,
        valor,
        forma_pagamento,
        status,
        data_pagamento
    ]):
        return jsonify({
            "erro": "Todos os campos são obrigatórios."
        }), 400

    conexao = conectar()

    # Verifica se o pagamento existe
    pagamento = conexao.execute("""
        SELECT id
        FROM pagamentos
        WHERE id = ? AND usuario_id = ?
    """, (id, usuario_id)).fetchone()

    if not pagamento:
        conexao.close()
        return jsonify({
            "erro": "Pagamento não encontrado."
        }), 404

    # Verifica se o agendamento existe
    agendamento = conexao.execute("""
        SELECT id
        FROM agendamentos
        WHERE id = ? AND usuario_id = ?
    """, (agendamento_id, usuario_id)).fetchone()

    if not agendamento:
        conexao.close()
        return jsonify({
            "erro": "Agendamento não encontrado."
        }), 404

    conexao.execute("""
        UPDATE pagamentos
        SET
            agendamento_id = ?,
            valor = ?,
            forma_pagamento = ?,
            status = ?,
            data_pagamento = ?
        WHERE id = ? AND usuario_id = ?
    """, (
        agendamento_id,
        valor,
        forma_pagamento,
        status,
        data_pagamento,
        id,
        usuario_id
    ))

    conexao.commit()
    conexao.close()

    return jsonify({
        "mensagem": "Pagamento atualizado com sucesso!"
    }), 200



@pagamentos_bp.route("/pagamentos/<int:id>", methods=["DELETE"])
@token_required
def excluir_pagamento(usuario_id, id):
    conexao = conectar()

    pagamento = conexao.execute("""
        SELECT id
        FROM pagamentos
        WHERE id = ? AND usuario_id = ?
    """, (id, usuario_id)).fetchone()

    if not pagamento:
        conexao.close()
        return jsonify({
            "erro": "Pagamento não encontrado."
        }), 404

    conexao.execute("""
        DELETE FROM pagamentos
        WHERE id = ? AND usuario_id = ?
    """, (id, usuario_id))

    conexao.commit()
    conexao.close()

    return jsonify({
        "mensagem": "Pagamento excluído com sucesso!"
    }), 200



@pagamentos_bp.route("/pagamentos/<int:id>/status", methods=["PUT"])
@token_required
def alterar_status(usuario_id, id):

    dados = request.json
    novo_status = dados.get("status")

    conexao = conectar()

    conexao.execute("""
        UPDATE pagamentos
        SET status = ?
        WHERE id = ? AND usuario_id = ?
    """, (novo_status, id, usuario_id))

    conexao.commit()
    conexao.close()

    return jsonify({
        "mensagem": "Status alterado com sucesso"
    })
