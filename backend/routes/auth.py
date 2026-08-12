from flask import Blueprint, jsonify, request

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/auth/login", methods=["POST"])
def login():
    dados = request.get_json()
    email = dados.get("email")
    senha = dados.get("senha")
    
    # Validação simples para fins de demonstração (MVP)
    if email == "admin@beautyflow.com" and senha == "admin123":
        return jsonify({
            "sucesso": True,
            "mensagem": "Login realizado com sucesso!",
            "token": "fake-jwt-token-12345",
            "usuario": {
                "nome": "Administrador",
                "email": "admin@beautyflow.com"
            }
        }), 200
    else:
        return jsonify({
            "sucesso": False,
            "erro": "E-mail ou senha incorretos."
        }), 401
