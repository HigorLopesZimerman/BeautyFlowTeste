from flask import Blueprint, jsonify, request
from database import conectar

pagamentos_bp = Blueprint("pagamentos", __name__)

@pagamentos_bp.route("/pagamentos", methods=["GET"])
def listar_pagamentos():
    conexao = conectar()

    pagamentos = conexao.execute("""
        SELECT
            p.id,

            p.agendamento_id,-------

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
    """).fetchall()

    conexao.close()

    return jsonify([dict(pagamento) for pagamento in pagamentos])



@pagamentos_bp.route("/pagamentos", methods=["POST"])
def cadastrar_pagamento():
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
        WHERE id = ?
    """, (agendamento_id,)).fetchone()

    if not agendamento:
        conexao.close()
        return jsonify({
            "erro": "Agendamento não encontrado."
        }), 404
        
    
    
    conexao.execute("""
        INSERT INTO pagamentos (
            agendamento_id,
            valor,
            forma_pagamento,
            status,
            data_pagamento
        )
        VALUES (?, ?, ?, ?, ?)
    """, (
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
def editar_pagamento(id):
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
        WHERE id = ?
    """, (id,)).fetchone()

    if not pagamento:
        conexao.close()
        return jsonify({
            "erro": "Pagamento não encontrado."
        }), 404

    # Verifica se o agendamento existe
    agendamento = conexao.execute("""
        SELECT id
        FROM agendamentos
        WHERE id = ?
    """, (agendamento_id,)).fetchone()

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
        WHERE id = ?
    """, (
        agendamento_id,
        valor,
        forma_pagamento,
        status,
        data_pagamento,
        id
    ))

    conexao.commit()
    conexao.close()

    return jsonify({
        "mensagem": "Pagamento atualizado com sucesso!"
    }), 200



@pagamentos_bp.route("/pagamentos/<int:id>", methods=["DELETE"])
def excluir_pagamento(id):
    conexao = conectar()

    pagamento = conexao.execute("""
        SELECT id
        FROM pagamentos
        WHERE id = ?
    """, (id,)).fetchone()

    if not pagamento:
        conexao.close()
        return jsonify({
            "erro": "Pagamento não encontrado."
        }), 404

    conexao.execute("""
        DELETE FROM pagamentos
        WHERE id = ?
    """, (id,))

    conexao.commit()
    conexao.close()

    return jsonify({
        "mensagem": "Pagamento excluído com sucesso!"
    }), 200


from flask import Blueprint, jsonify, request
from database import conectar

pagamentos_bp = Blueprint("pagamentos", __name__)

@pagamentos_bp.route("/pagamentos", methods=["GET"])
def listar_pagamentos():
    conexao = conectar()

    pagamentos = conexao.execute("""
        SELECT
            p.id,

            p.agendamento_id,-------

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
    """).fetchall()

    conexao.close()

    return jsonify([dict(pagamento) for pagamento in pagamentos])



@pagamentos_bp.route("/pagamentos", methods=["POST"])
def cadastrar_pagamento():
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
        WHERE id = ?
    """, (agendamento_id,)).fetchone()

    if not agendamento:
        conexao.close()
        return jsonify({
            "erro": "Agendamento não encontrado."
        }), 404
        
    
    
    conexao.execute("""
        INSERT INTO pagamentos (
            agendamento_id,
            valor,
            forma_pagamento,
            status,
            data_pagamento
        )
        VALUES (?, ?, ?, ?, ?)
    """, (
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
def editar_pagamento(id):
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
        WHERE id = ?
    """, (id,)).fetchone()

    if not pagamento:
        conexao.close()
        return jsonify({
            "erro": "Pagamento não encontrado."
        }), 404

    # Verifica se o agendamento existe
    agendamento = conexao.execute("""
        SELECT id
        FROM agendamentos
        WHERE id = ?
    """, (agendamento_id,)).fetchone()

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
        WHERE id = ?
    """, (
        agendamento_id,
        valor,
        forma_pagamento,
        status,
        data_pagamento,
        id
    ))

    conexao.commit()
    conexao.close()

    return jsonify({
        "mensagem": "Pagamento atualizado com sucesso!"
    }), 200



@pagamentos_bp.route("/pagamentos/<int:id>", methods=["DELETE"])
def excluir_pagamento(id):
    conexao = conectar()

    pagamento = conexao.execute("""
        SELECT id
        FROM pagamentos
        WHERE id = ?
    """, (id,)).fetchone()

    if not pagamento:
        conexao.close()
        return jsonify({
            "erro": "Pagamento não encontrado."
        }), 404

    conexao.execute("""
        DELETE FROM pagamentos
        WHERE id = ?
    """, (id,))

    conexao.commit()
    conexao.close()

    return jsonify({
        "mensagem": "Pagamento excluído com sucesso!"
    }), 200



@pagamentos_bp.route("/pagamentos/<int:id>/status", methods=["PUT"])
def alterar_status(id):

    dados = request.json
    novo_status = dados.get("status")

    conexao = conectar()

    conexao.execute("""
        UPDATE pagamentos
        SET status = ?
        WHERE id = ?
    """, (novo_status, id))

    conexao.commit()
    conexao.close()

    return jsonify({
        "mensagem": "Status alterado com sucesso"
    })

