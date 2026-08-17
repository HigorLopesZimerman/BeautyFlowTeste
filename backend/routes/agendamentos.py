from flask import Blueprint, request, jsonify
from database import conectar
from routes.auth import token_required

agendamentos_bp = Blueprint("agendamentos", __name__)

@agendamentos_bp.route("/agendamentos", methods=["GET"])
@token_required
def listar_agendamentos(usuario_id):
    conexao = conectar()
    
    agendamentos = conexao.execute("""
        SELECT
             ag.id,
             
             ag.cliente_id,
             ag.funcionario_id,
             ag.servico_id,
             
             c.nome AS cliente,
             f.nome AS funcionario,
             s.nome AS servico,
             
             ag.data,
             ag.hora,
             ag.status
        
        FROM agendamentos ag
        
        JOIN clientes c
            ON ag.cliente_id = c.id
            
        JOIN funcionarios f
            ON ag.funcionario_id = f.id
            
        JOIN servicos s
            ON ag.servico_id = s.id
            
        WHERE ag.usuario_id = ?
        
    """, (usuario_id,)).fetchall()
    
    conexao.close()
    
    return jsonify([dict(agendamento) for agendamento in agendamentos])


@agendamentos_bp.route("/agendamentos", methods=["POST"])
@token_required
def cadastrar_agendamento(usuario_id):
    dados = request.get_json()
    
    cliente_id = dados.get("cliente_id")
    funcionario_id = dados.get("funcionario_id")
    servico_id = dados.get("servico_id")
    data = dados.get("data")
    hora = dados.get("hora")
    hora_fim = dados.get("hora_fim")
    status = dados.get("status", "agendado")
    
    if not all([cliente_id, funcionario_id, servico_id, data, hora]):
        return jsonify({
            "erro": "Todos os campos são obrigatórios."
        }), 400
        
    conexao = conectar()
    
    cliente = conexao.execute(
        "SELECT id FROM clientes WHERE id = ? AND usuario_id = ?",
        (cliente_id, usuario_id)
    ).fetchone()
    
    if not cliente:
        conexao.close()
        return jsonify({
            "erro": "Cliente não encontrado."
        }), 404
        
        
    funcionario = conexao.execute(
        "SELECT id FROM funcionarios WHERE id = ? AND usuario_id = ?",
        (funcionario_id, usuario_id)
    ).fetchone()

    if not funcionario:
        conexao.close()
        return jsonify({
            "erro": "Funcionário não encontrado."
            }), 404
    
    
    servico = conexao.execute(
        "SELECT id FROM servicos WHERE id = ? AND usuario_id = ?",
        (servico_id, usuario_id)
    ).fetchone()

    if not servico:
        conexao.close()
        return jsonify({
            "erro": "Serviço não encontrado."
            }), 404
    
    
    agendamento_existente = conexao.execute("""
        SELECT id
        FROM agendamentos
        WHERE funcionario_id = ?
        AND data = ?
        AND hora = ?
        AND usuario_id = ?
    """, (
        funcionario_id,
        data,
        hora,
        usuario_id
    )).fetchone()
    
    if agendamento_existente:
        conexao.close()
        return jsonify({
            "erro": "Este funcionário já possui um agendamento nesse horário."
        }), 400
        
        
    conexao.execute("""
        INSERT INTO agendamentos (
            usuario_id,
            cliente_id,
            funcionario_id,
            servico_id,
            data,
            hora,
            hora_fim,
            status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        usuario_id,
        cliente_id,
        funcionario_id,
        servico_id,
        data,
        hora,
        hora_fim,
        status
    ))
    
    conexao.commit()
    conexao.close()
    
    return jsonify({
        "mensagem": "Agendamento cadastrado com sucesso!"
    }), 201
    
    
    
@agendamentos_bp.route("/agendamentos/<int:id>", methods=["PUT"])
@token_required
def editar_agendamento(usuario_id, id):
    dados = request.get_json()

    cliente_id = dados.get("cliente_id")
    funcionario_id = dados.get("funcionario_id")
    servico_id = dados.get("servico_id")
    data = dados.get("data")
    hora = dados.get("hora")
    hora_fim = dados.get("hora_fim")
    status = dados.get("status")

    if not all([
        cliente_id,
        funcionario_id,
        servico_id,
        data,
        hora,
        status
    ]):
        return jsonify({
            "erro": "Todos os campos são obrigatórios."
        }), 400

    conexao = conectar()

    # Verifica se o agendamento existe e pertence ao usuário
    agendamento = conexao.execute("""
        SELECT id
        FROM agendamentos
        WHERE id = ? AND usuario_id = ?
    """, (id, usuario_id)).fetchone()

    if not agendamento:
        conexao.close()
        return jsonify({
            "erro": "Agendamento não encontrado."
        }), 404

    # Verifica se o cliente existe
    cliente = conexao.execute(
        "SELECT id FROM clientes WHERE id = ? AND usuario_id = ?",
        (cliente_id, usuario_id)
    ).fetchone()

    if not cliente:
        conexao.close()
        return jsonify({
            "erro": "Cliente não encontrado."
        }), 404

    # Verifica se o funcionário existe
    funcionario = conexao.execute(
        "SELECT id FROM funcionarios WHERE id = ? AND usuario_id = ?",
        (funcionario_id, usuario_id)
    ).fetchone()

    if not funcionario:
        conexao.close()
        return jsonify({
            "erro": "Funcionário não encontrado."
        }), 404

    # Verifica se o serviço existe
    servico = conexao.execute(
        "SELECT id FROM servicos WHERE id = ? AND usuario_id = ?",
        (servico_id, usuario_id)
    ).fetchone()

    if not servico:
        conexao.close()
        return jsonify({
            "erro": "Serviço não encontrado."
        }), 404

    # Verifica conflito de horário
    agendamento_existente = conexao.execute("""
        SELECT id
        FROM agendamentos
        WHERE funcionario_id = ?
        AND data = ?
        AND hora = ?
        AND id != ?
        AND usuario_id = ?
    """, (
        funcionario_id,
        data,
        hora,
        id,
        usuario_id
    )).fetchone()

    if agendamento_existente:
        conexao.close()
        return jsonify({
            "erro": "Este funcionário já possui um agendamento nesse horário."
        }), 400

    # Atualiza o agendamento
    conexao.execute("""
        UPDATE agendamentos
        SET
            cliente_id = ?,
            funcionario_id = ?,
            servico_id = ?,
            data = ?,
            hora = ?,
            hora_fim = ?,
            status = ?
        WHERE id = ? AND usuario_id = ?
    """, (
        cliente_id,
        funcionario_id,
        servico_id,
        data,
        hora,
        hora_fim,
        status,
        id,
        usuario_id
    ))

    conexao.commit()
    conexao.close()

    return jsonify({
        "mensagem": "Agendamento atualizado com sucesso!"
    }), 200


@agendamentos_bp.route("/agendamentos/<int:id>/status", methods=["PUT"])
@token_required
def alterar_status(usuario_id, id):

    dados = request.get_json()

    status = dados.get("status")

    if not status:
        return jsonify({
            "erro": "Informe um status."
        }), 400

    conexao = conectar()

    agendamento = conexao.execute("""
        SELECT id
        FROM agendamentos
        WHERE id = ? AND usuario_id = ?
    """, (id, usuario_id)).fetchone()

    if not agendamento:
        conexao.close()
        return jsonify({
            "erro": "Agendamento não encontrado."
        }), 404

    conexao.execute("""
        UPDATE agendamentos
        SET status = ?
        WHERE id = ? AND usuario_id = ?
    """, (
        status,
        id,
        usuario_id
    ))

    conexao.commit()
    conexao.close()

    return jsonify({
        "mensagem": "Status atualizado com sucesso!"
    }), 200
    
    
    
@agendamentos_bp.route("/agendamentos/<int:id>", methods=["DELETE"])
@token_required
def excluir_agendamento(usuario_id, id):
    conexao = conectar()
    
    # Verifica se o agendamento existe
    agendamento = conexao.execute("""
        SELECT id
        FROM agendamentos
        WHERE id = ? AND usuario_id = ?
    """, (id, usuario_id)).fetchone()
    
    if not agendamento:
        conexao.close()
        return jsonify({
            "erro": "Agendamento não encontrado."
        }), 404
        
        
    # Exclui o agendamento
    conexao.execute("""
        DELETE FROM agendamentos
        WHERE id = ? AND usuario_id = ?
    """, (id, usuario_id))
    
    conexao.commit()
    conexao.close()
    
    return jsonify({
        "mensagem": "Agendamento excluído com sucesso!"
    }), 200