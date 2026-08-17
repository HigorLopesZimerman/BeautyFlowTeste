from flask import Blueprint, request, jsonify
from database import conectar
from routes.auth import token_required

servicos_bp = Blueprint("servicos", __name__)

@servicos_bp.route("/servicos", methods=["GET"])
@token_required
def listar_servicos(usuario_id):
    conexao = conectar()
    
    servicos = conexao.execute(
        "SELECT * FROM servicos WHERE usuario_id = ?",
        (usuario_id,)
    ).fetchall()
    
    conexao.close()
    
    return jsonify([dict(servico) for servico in servicos])

@servicos_bp.route("/servicos", methods=["POST"])
@token_required
def cadastrar_servico(usuario_id):
    dados = request.get_json()
    
    nome = dados.get("nome")
    duracao = dados.get("duracao")
    preco = dados.get("preco")
    
    
    if not nome or duracao is None or preco is None:
        return jsonify({
            "erro": "Nome, preço e duração são obrigatórios."
        }), 400
    
    conexao = conectar()
    cursor = conexao.cursor()
    
    cursor.execute(
        """
        INSERT INTO servicos (usuario_id, nome, duracao, preco)
        VALUES (?, ?, ?, ?)
        """,
        (usuario_id, nome, duracao, preco)
    )
    
    conexao.commit()
    servico_id = cursor.lastrowid
    conexao.close()
    
    return jsonify({
        "mensagem": "Serviço cadastrado com sucesso!",
        "id": servico_id
    }), 201
    
@servicos_bp.route("/servicos/<int:id>", methods=["PUT"])
@token_required
def editar_servico(usuario_id, id):
    dados = request.get_json()
    
    nome = dados.get("nome")
    duracao = dados.get("duracao")
    preco = dados.get("preco")
    
    if not nome or duracao is None or preco is None:
        return jsonify({
            "erro": "Nome, preço e duração são obrigatórios."
        }), 400
    
    conexao = conectar()
    cursor = conexao.cursor()
    
    cursor.execute(
        """
        UPDATE servicos
        SET nome = ?, duracao = ?, preco = ? 
        WHERE id = ? AND usuario_id = ?
        """,
        (nome, duracao, preco, id, usuario_id)
    )
    
    conexao.commit()
    conexao.close()
    
    return jsonify({
        "mensagem": "Serviço atualizado com sucesso!"
    }), 200
    
@servicos_bp.route("/servicos/<int:id>", methods=["DELETE"])
@token_required
def excluir_servico(usuario_id, id):
    conexao = conectar()
    cursor = conexao.cursor()
    
    cursor.execute(
        "DELETE FROM servicos WHERE id = ? AND usuario_id = ?",
        (id, usuario_id)
    )
    
    conexao.commit()
    conexao.close()
    
    return jsonify({
        "mensagem": "Serviço excluído com sucesso!"
    }), 200