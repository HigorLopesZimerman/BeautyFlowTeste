from flask import Blueprint, jsonify, request
from database import conectar
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
from functools import wraps

auth_bp = Blueprint("auth", __name__)
SECRET_KEY = "beautyflow_super_secret"

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if "Authorization" in request.headers:
            parts = request.headers["Authorization"].split()
            if len(parts) == 2 and parts[0] == "Bearer":
                token = parts[1]
                
        if not token:
            return jsonify({"sucesso": False, "erro": "Token ausente."}), 401
            
        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            usuario_id = data["usuario_id"]
        except jwt.ExpiredSignatureError:
            return jsonify({"sucesso": False, "erro": "Token expirado."}), 401
        except jwt.InvalidTokenError:
            return jsonify({"sucesso": False, "erro": "Token inválido."}), 401
            
        return f(usuario_id, *args, **kwargs)
        
    return decorated

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
        SELECT id, nome, email, senha
        FROM usuarios
        WHERE email = ?
    """, (email,)).fetchone()
    conexao.close()
    
    if usuario and check_password_hash(usuario["senha"], senha):
        token = jwt.encode({
            "usuario_id": usuario["id"],
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, SECRET_KEY, algorithm="HS256")
        
        return jsonify({
            "sucesso": True,
            "mensagem": "Login realizado com sucesso!",
            "token": token,
            "usuario": {
                "id": usuario["id"],
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

