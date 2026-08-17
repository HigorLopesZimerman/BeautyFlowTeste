from flask import Blueprint, request, jsonify
from database import conectar
from routes.auth import token_required

funcionarios_bp = Blueprint("funcionarios", __name__)

@funcionarios_bp.route("/funcionarios", methods=["GET"])
@token_required
def listar_funcionarios(usuario_id):
    conexao = conectar()

    funcionarios = conexao.execute(
        "SELECT * FROM funcionarios WHERE usuario_id = ?",
        (usuario_id,)
    ).fetchall()

    conexao.close()

    return jsonify([dict(funcionario) for funcionario in funcionarios])


@funcionarios_bp.route("/funcionarios", methods=["POST"])
@token_required
def cadastrar_funcionario(usuario_id):
    dados = request.get_json()

    nome = dados.get("nome")
    funcao = dados.get("funcao")
    telefone = dados.get("telefone")
    email = dados.get("email")

    if not nome or not funcao:
        return jsonify({
            "erro": "Nome e função são obrigatórios."
        }), 400

    conexao = conectar()
    cursor = conexao.cursor()

    cursor.execute(
        """
        INSERT INTO funcionarios (usuario_id, nome, funcao, telefone, email)
        VALUES (?, ?, ?, ?, ?)
        """,
        (usuario_id, nome, funcao, telefone, email)
    )

    conexao.commit()
    funcionario_id = cursor.lastrowid
    conexao.close()

    return jsonify({
        "mensagem": "Funcionário cadastrado com sucesso!",
        "id": funcionario_id
    }), 201
    
    
@funcionarios_bp.route("/funcionarios/<int:id>", methods=["PUT"])
@token_required
def editar_funcionario(usuario_id, id):
    dados = request.get_json()

    nome = dados.get("nome")
    funcao = dados.get("funcao")
    telefone = dados.get("telefone")
    email = dados.get("email")

    if not nome or not funcao:
        return jsonify({
            "erro": "Nome e função são obrigatórios."
        }), 400

    conexao = conectar()

    conexao.execute(
        """
        UPDATE funcionarios
        SET nome = ?, funcao = ?, telefone = ?, email = ?
        WHERE id = ? AND usuario_id = ?
        """,
        (nome, funcao, telefone, email, id, usuario_id)
    )

    conexao.commit()
    conexao.close()

    return jsonify({
        "mensagem": "Funcionário atualizado com sucesso!"
    })
    
@funcionarios_bp.route("/funcionarios/<int:id>", methods=["DELETE"])
@token_required
def excluir_funcionario(usuario_id, id):
    conexao = conectar()

    conexao.execute(
        "DELETE FROM funcionarios WHERE id = ? AND usuario_id = ?",
        (id, usuario_id)
    )

    conexao.commit()
    conexao.close()

    return jsonify({
        "mensagem": "Funcionário excluído com sucesso!"
    })