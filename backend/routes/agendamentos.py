from flask import Blueprint, request, jsonify
from database import conectar

agendamentos_bp = Blueprint("agendamentos", __name__)

@agendamentos_bp.route("/agendamentos", methods=["GET"])
def listar_agendamentos():
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
        
    """).fetchall()
    
    conexao.close()
    
    return jsonify([dict(agendamento) for agendamento in agendamentos])


@agendamentos_bp.route("/agendamentos", methods=["POST"])
def cadastrar_agendamento():
    dados = request.get_json()
    
    cliente_id = dados.get("cliente_id")
    funcionario_id = dados.get("funcionario_id")
    servico_id = dados.get("servico_id")
    data = dados.get("data")
    hora = dados.get("hora")
    
    if not all([cliente_id, funcionario_id, servico_id, data, hora]):
        return jsonify({
            "erro": "Todos os campos são obrigatórios."
        }), 400
        
    conexao = conectar()
    
    cliente = conexao.execute(
        "SELECT id FROM clientes WHERE id = ?",
        (cliente_id,)
    ).fetchone()
    
    if not cliente:
        conexao.close()
        return jsonify({
            "erro": "Cliente não encontrado."
        }), 404
        
        
    funcionario = conexao.execute(
        "SELECT id FROM funcionarios WHERE id = ?",
        (funcionario_id,)
    ).fetchone()

    if not funcionario:
        conexao.close()
        return jsonify({
            "erro": "Funcionário não encontrado."
            }), 404
    
    
    servico = conexao.execute(
        "SELECT id FROM servicos WHERE id = ?",
        (servico_id,)
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
    """, (
        funcionario_id,
        data,
        hora,
    )).fetchone()
    
    if agendamento_existente:
        conexao.close()
        return jsonify({
            "erro": "Este funcionário já possui um agendamento nesse horário."
        }), 400
        
        
    conexao.execute("""
        INSERT INTO agendamentos (
            cliente_id,
            funcionario_id,
            servico_id,
            data,
            hora
        )
        VALUES (?, ?, ?, ?, ?)
    """, (
        cliente_id,
        funcionario_id,
        servico_id,
        data,
        hora
    ))
    
    conexao.commit()
    conexao.close()
    
    return jsonify({
        "mensagem": "Agendamento cadastrado com sucesso!"
    }), 201
    
    
    
    
    
@agendamentos_bp.route("/agendamentos/<int:id>", methods=["PUT"])
def editar_agendamento(id):
    dados = request.get_json()

    cliente_id = dados.get("cliente_id")
    funcionario_id = dados.get("funcionario_id")
    servico_id = dados.get("servico_id")
    data = dados.get("data")
    hora = dados.get("hora")
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

    # Verifica se o agendamento existe
    agendamento = conexao.execute("""
        SELECT id
        FROM agendamentos
        WHERE id = ?
    """, (id,)).fetchone()

    if not agendamento:
        conexao.close()
        return jsonify({
            "erro": "Agendamento não encontrado."
        }), 404

    # Verifica se o cliente existe
    cliente = conexao.execute(
        "SELECT id FROM clientes WHERE id = ?",
        (cliente_id,)
    ).fetchone()

    if not cliente:
        conexao.close()
        return jsonify({
            "erro": "Cliente não encontrado."
        }), 404

    # Verifica se o funcionário existe
    funcionario = conexao.execute(
        "SELECT id FROM funcionarios WHERE id = ?",
        (funcionario_id,)
    ).fetchone()

    if not funcionario:
        conexao.close()
        return jsonify({
            "erro": "Funcionário não encontrado."
        }), 404

    # Verifica se o serviço existe
    servico = conexao.execute(
        "SELECT id FROM servicos WHERE id = ?",
        (servico_id,)
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
    """, (
        funcionario_id,
        data,
        hora,
        id
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
            status = ?
        WHERE id = ?
    """, (
        cliente_id,
        funcionario_id,
        servico_id,
        data,
        hora,
        status,
        id
    ))

    conexao.commit()
    conexao.close()

    return jsonify({
        "mensagem": "Agendamento atualizado com sucesso!"
    }), 200


@agendamentos_bp.route("/agendamentos/<int:id>/status", methods=["PUT"])
def alterar_status(id):

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
        WHERE id = ?
    """, (id,)).fetchone()

    if not agendamento:
        conexao.close()
        return jsonify({
            "erro": "Agendamento não encontrado."
        }), 404

    conexao.execute("""
        UPDATE agendamentos
        SET status = ?
        WHERE id = ?
    """, (
        status,
        id
    ))

    conexao.commit()
    conexao.close()

    return jsonify({
        "mensagem": "Status atualizado com sucesso!"
    }), 200
    
    
    
@agendamentos_bp.route("/agendamentos/<int:id>", methods=["DELETE"])
def excluir_agendamento(id):
    conexao = conectar()
    
    # Verifica se o agendamento existe
    agendamento = conexao.execute("""
        SELECT id
        FROM agendamentos
        WHERE id = ?
    """, (id,)).fetchone()
    
    if not agendamento:
        conexao.close()
        return jsonify({
            "erro": "Agendamento não encontrado."
        }), 404
        
        
    # Exclui o agendamento
    conexao.execute("""
        DELETE FROM agendamentos
        WHERE id = ?
    """, (id,))
    
    conexao.commit()
    conexao.close()
    
    return jsonify({
        "mensagem": "Agendamento excluído com sucesso!"
    }), 200