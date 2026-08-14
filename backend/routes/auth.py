from flask import Blueprint, jsonify, request
from database import conectar
from werkzeug.security import generate_password_hash, check_password_hash

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/auth/login", methods=["POST"])
def login():
    dados = request.get_json()
    email = dados.get("email")
    senha = dados.get("senha")
    
    if not email or not senha:
        return jsonify({
            "sucesso": False,
            "erro": "E-mail e senha são obrigatórios."
        }), 400

    conexao = conectar()
    usuario = conexao.execute("""
        SELECT nome, email, senha
        FROM usuarios
        WHERE email = ?
    """, (email,)).fetchone()
    conexao.close()
    
    if usuario and check_password_hash(usuario["senha"], senha):
        return jsonify({
            "sucesso": True,
            "mensagem": "Login realizado com sucesso!",
            "token": f"fake-jwt-token-{usuario['email']}",
            "usuario": {
                "nome": usuario["nome"],
                "email": usuario["email"]
            }
        }), 200
    else:
        return jsonify({
            "sucesso": False,
            "erro": "E-mail ou senha incorretos."
        }), 401


@auth_bp.route("/auth/register", methods=["POST"])
def register():
    dados = request.get_json()
    nome = dados.get("nome")
    email = dados.get("email")
    senha = dados.get("senha")
    
    if not nome or not email or not senha:
        return jsonify({
            "sucesso": False,
            "erro": "Todos os campos (nome, email, senha) são obrigatórios."
        }), 400
        
    conexao = conectar()
    
    # Verifica se o email já está em uso
    existente = conexao.execute("""
        SELECT id FROM usuarios WHERE email = ?
    """, (email,)).fetchone()
    
    if existente:
        conexao.close()
        return jsonify({
            "sucesso": False,
            "erro": "Este e-mail já está cadastrado."
        }), 400
        
    # Insere novo usuário com hash de senha
    senha_hash = generate_password_hash(senha)
    try:
        conexao.execute("""
            INSERT INTO usuarios (nome, email, senha)
            VALUES (?, ?, ?)
        """, (nome, email, senha_hash))
        conexao.commit()
        conexao.close()
        return jsonify({
            "sucesso": True,
            "mensagem": "Conta criada com sucesso! Faça login para continuar."
        }), 201
    except Exception as e:
        conexao.close()
        return jsonify({
            "sucesso": False,
            "erro": f"Erro ao criar conta: {str(e)}"
        }), 500

