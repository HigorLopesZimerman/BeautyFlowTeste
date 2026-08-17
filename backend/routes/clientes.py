from flask import Blueprint, request, jsonify
from database import conectar
from routes.auth import token_required

clientes_bp = Blueprint("clientes", __name__)

# ==================== CLIENTES ====================

# Listar clientes
@clientes_bp.route("/clientes", methods=["GET"])
@token_required
def listar_clientes(usuario_id):
    conexao = conectar()

    clientes = conexao.execute(
        "SELECT * FROM clientes WHERE usuario_id = ?",
        (usuario_id,)
    ).fetchall()

    conexao.close()

    return jsonify([dict(cliente) for cliente in clientes])


@clientes_bp.route("/clientes/<int:id>/historico", methods=["GET"])
@token_required
def historico_cliente(usuario_id, id):
    conexao = conectar()

    # Busca o último agendamento (concluído) desse cliente
    ultimo_agendamento = conexao.execute("""
        SELECT a.data, s.nome as servico
        FROM agendamentos a
        JOIN servicos s ON a.servico_id = s.id
        WHERE a.cliente_id = ? AND a.usuario_id = ? AND a.status = 'concluido'
        ORDER BY a.data DESC, a.hora DESC
        LIMIT 1
    """, (id, usuario_id)).fetchone()

    conexao.close()

    if ultimo_agendamento:
        return jsonify({
            "tem_historico": True,
            "data_ultima_visita": ultimo_agendamento["data"],
            "servico_ultima_visita": ultimo_agendamento["servico"]
        })
    else:
        return jsonify({
            "tem_historico": False
        })


# Cadastrar cliente
@clientes_bp.route("/clientes", methods=["POST"])
@token_required
def cadastrar_cliente(usuario_id):
    dados = request.get_json()

    nome = dados.get("nome")
    telefone = dados.get("telefone")
    email = dados.get("email")
    nota = dados.get("nota")

    if not nome or not telefone:
        return jsonify({
            "erro": "Nome e telefone são obrigatórios."
        }), 400

    conexao = conectar()
    cursor = conexao.cursor()

    cursor.execute(
        """
        INSERT INTO clientes (usuario_id, nome, telefone, email, nota)
        VALUES (?, ?, ?, ?, ?)
        """,
        (usuario_id, nome, telefone, email, nota)
    )

    conexao.commit()
    cliente_id = cursor.lastrowid
    conexao.close()

    return jsonify({
        "mensagem": "Cliente cadastrado com sucesso!",
        "id": cliente_id
    }), 201


# Editar cliente
@clientes_bp.route("/clientes/<int:id>", methods=["PUT"])
@token_required
def editar_cliente(usuario_id, id):
    dados = request.get_json()

    nome = dados.get("nome")
    telefone = dados.get("telefone")
    email = dados.get("email")
    nota = dados.get("nota")

    if not nome or not telefone:
        return jsonify({
            "erro": "Nome e telefone são obrigatórios."
        }), 400

    conexao = conectar()

    conexao.execute(
        """
        UPDATE clientes
        SET nome = ?, telefone = ?, email = ?, nota = ?
        WHERE id = ? AND usuario_id = ?
        """,
        (nome, telefone, email, nota, id, usuario_id)
    )

    conexao.commit()
    conexao.close()

    return jsonify({
        "mensagem": "Cliente atualizado com sucesso!"
    })


# Excluir cliente
@clientes_bp.route("/clientes/<int:id>", methods=["DELETE"])
@token_required
def excluir_cliente(usuario_id, id):
    conexao = conectar()

    conexao.execute(
        "DELETE FROM clientes WHERE id = ? AND usuario_id = ?",
        (id, usuario_id)
    )

    conexao.commit()
    conexao.close()

    return jsonify({
        "mensagem": "Cliente excluído com sucesso!"
    })

# Buscar clientes ausentes (retenção)
@clientes_bp.route("/clientes/ausentes", methods=["GET"])
@token_required
def clientes_ausentes(usuario_id):
    conexao = conectar()
    
    # Busca clientes cujo último agendamento foi há mais de 30 dias
    clientes = conexao.execute("""
        SELECT c.id, c.nome, c.telefone, MAX(a.data) as ultima_visita
        FROM clientes c
        JOIN agendamentos a ON c.id = a.cliente_id
        WHERE a.status = 'concluido' AND c.usuario_id = ?
        GROUP BY c.id, c.nome, c.telefone
        HAVING date(ultima_visita) <= date('now', '-30 days')
        ORDER BY ultima_visita ASC
        LIMIT 5
    """, (usuario_id,)).fetchall()
    
    conexao.close()
    
    return jsonify([dict(cliente) for cliente in clientes])
