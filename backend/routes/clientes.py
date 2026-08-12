from flask import Blueprint, request, jsonify
from database import conectar

clientes_bp = Blueprint("clientes", __name__)

# ==================== CLIENTES ====================

# Listar clientes
@clientes_bp.route("/clientes", methods=["GET"])
def listar_clientes():
    conexao = conectar()

    clientes = conexao.execute(
        "SELECT * FROM clientes"
    ).fetchall()

    conexao.close()

    return jsonify([dict(cliente) for cliente in clientes])


# Cadastrar cliente
@clientes_bp.route("/clientes", methods=["POST"])
def cadastrar_cliente():
    dados = request.get_json()

    nome = dados.get("nome")
    telefone = dados.get("telefone")
    email = dados.get("email")
    nota = dados.get("nota")

    # Nome e telefone são obrigatórios
    if not nome or not telefone:
        return jsonify({
            "erro": "Nome e telefone são obrigatórios."
        }), 400

    conexao = conectar()
    cursor = conexao.cursor()

    cursor.execute(
        """
        INSERT INTO clientes (nome, telefone, email, nota)
        VALUES (?, ?, ?, ?)
        """,
        (nome, telefone, email, nota)
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
def editar_cliente(id):
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
        WHERE id = ?
        """,
        (nome, telefone, email, nota, id)
    )

    conexao.commit()
    conexao.close()

    return jsonify({
        "mensagem": "Cliente atualizado com sucesso!"
    })


# Excluir cliente
@clientes_bp.route("/clientes/<int:id>", methods=["DELETE"])
def excluir_cliente(id):
    conexao = conectar()

    conexao.execute(
        "DELETE FROM clientes WHERE id = ?",
        (id,)
    )

    conexao.commit()
    conexao.close()

    return jsonify({
        "mensagem": "Cliente excluído com sucesso!"
    })
