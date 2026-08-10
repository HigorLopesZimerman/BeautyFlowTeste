from flask import Blueprint, request, jsonify
from database import conectar

servicos_bp = Blueprint("servicos", __name__)

@servicos_bp.route("/servicos", methods=["GET"])
def listar_servicos():
    conexao = conectar()
    
    servicos = conexao.execute(
        "SELECT * FROM servicos"
    ).fetchall()
    
    conexao.close()
    
    return jsonify([dict(servico) for servico in servicos])

@servicos_bp.route("/servicos", methods=["POST"])
def cadastrar_servico():
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
        INSERT INTO servicos (nome, duracao, preco)
        VALUES (?, ?, ?)
        """,
        (nome, duracao, preco)
    )
    
    conexao.commit()
    servico_id = cursor.lastrowid
    conexao.close()
    
    return jsonify({
        "mensagem": "Serviço cadastrado com sucesso!",
        "id": servico_id
    }), 201
    
@servicos_bp.route("/servicos/<int:id>", methods=["PUT"])
def editar_servico(id):
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
        WHERE id = ?
        """,
        (nome, duracao, preco, id)
    )
    
    conexao.commit()
    conexao.close()
    
    return jsonify({
        "mensagem": "Serviço atualizado com sucesso!"
    }), 200
    
@servicos_bp.route("/servicos/<int:id>", methods=["DELETE"])
def excluir_servico(id):
    conexao = conectar()
    cursor = conexao.cursor()
    
    cursor.execute(
        "DELETE FROM servicos WHERE id = ?",
        (id,)
    )
    
    conexao.commit()
    conexao.close()
    
    return jsonify({
        "mensagem": "Serviço excluído com sucesso!"
    }), 200