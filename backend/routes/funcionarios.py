from flask import Blueprint, request, jsonify
from database import conectar

funcionarios_bp = Blueprint("funcionarios", __name__)

@funcionarios_bp.route("/funcionarios", methods=["GET"])
def listar_funcionarios():
    conexao = conectar()

    funcionarios = conexao.execute(
        "SELECT * FROM funcionarios"
    ).fetchall()

    conexao.close()

    return jsonify([dict(funcionario) for funcionario in funcionarios])


@funcionarios_bp.route("/funcionarios", methods=["POST"])
def cadastrar_funcionario():
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
        INSERT INTO funcionarios (nome, funcao, telefone, email)
        VALUES (?, ?, ?, ?)
        """,
        (nome, funcao, telefone, email)
    )

    conexao.commit()
    funcionario_id = cursor.lastrowid
    conexao.close()

    return jsonify({
        "mensagem": "Funcionário cadastrado com sucesso!",
        "id": funcionario_id
    }), 201
    
    
@funcionarios_bp.route("/funcionarios/<int:id>", methods=["PUT"])
def editar_funcionario(id):
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
        WHERE id = ?
        """,
        (nome, funcao, telefone, email, id)
    )

    conexao.commit()
    conexao.close()

    return jsonify({
        "mensagem": "Funcionário atualizado com sucesso!"
    })
    
@funcionarios_bp.route("/funcionarios/<int:id>", methods=["DELETE"])
def excluir_funcionario(id):
    conexao = conectar()

    conexao.execute(
        "DELETE FROM funcionarios WHERE id = ?",
        (id,)
    )

    conexao.commit()
    conexao.close()

    return jsonify({
        "mensagem": "Funcionário excluído com sucesso!"
    })