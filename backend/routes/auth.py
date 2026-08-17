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
        if request.method == "OPTIONS":
            return f(None, *args, **kwargs)
            
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

@auth_bp.route("/auth/forgot-password", methods=["POST"])
def forgot_password():
    dados = request.get_json()
    email = dados.get("email")
    
    if not email:
        return jsonify({"sucesso": False, "erro": "E-mail é obrigatório."}), 400
        
    conexao = conectar()
    usuario = conexao.execute("SELECT id, nome FROM usuarios WHERE email = ?", (email,)).fetchone()
    conexao.close()
    
    if not usuario:
        # Por segurança, mesmo se não existir não avisamos que não existe (previne enumeração)
        return jsonify({"sucesso": True, "mensagem": "Se o e-mail existir, um link de recuperação será gerado."}), 200
        
    # Gerar token válido por 15 minutos
    reset_token = jwt.encode({
        "usuario_id": usuario["id"],
        "purpose": "password_reset",
        "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=15)
    }, SECRET_KEY, algorithm="HS256")
    
    # Enviar o e-mail real usando SMTP do Gmail
    try:
        import smtplib
        from email.mime.text import MIMEText
        from email.mime.multipart import MIMEMultipart

        # Como a aplicação está na Vercel e o backend no ngrok/local, precisamos de uma URL dinâmica
        # Por enquanto usaremos a URL da Vercel ou localhost, dependendo do header origin
        origin = request.headers.get("Origin", "https://beautyflow.vercel.app")
        reset_link = f"{origin}/reset-password?token={reset_token}"
        
        remetente = "atendimentobeautyflow@gmail.com"
        senha_app = "kwny girv fvjz wqza"
        
        msg = MIMEMultipart()
        msg["From"] = f"BeautyFlow <{remetente}>"
        msg["To"] = email
        msg["Subject"] = "Recuperação de Senha - BeautyFlow"
        
        corpo = f"""
        Olá {usuario['nome']},
        
        Você solicitou a recuperação da sua senha no BeautyFlow.
        Clique no link abaixo para criar uma nova senha (este link expira em 15 minutos):
        
        {reset_link}
        
        Se você não solicitou isso, pode ignorar este e-mail com segurança.
        
        Atenciosamente,
        Equipe BeautyFlow
        """
        msg.attach(MIMEText(corpo, "plain"))
        
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(remetente, senha_app)
        server.send_message(msg)
        server.quit()
        
        return jsonify({
            "sucesso": True,
            "mensagem": "Um e-mail de recuperação foi enviado para você! (Verifique também sua caixa de Spam/Lixo Eletrônico)"
        }), 200
        
    except Exception as e:
        print(f"Erro ao enviar e-mail: {e}")
        return jsonify({
            "sucesso": False,
            "erro": "Não foi possível enviar o e-mail no momento. Tente novamente mais tarde."
        }), 500

@auth_bp.route("/auth/reset-password", methods=["POST"])
def reset_password():
    dados = request.get_json()
    token = dados.get("token")
    nova_senha = dados.get("nova_senha")
    
    if not token or not nova_senha:
        return jsonify({"sucesso": False, "erro": "Token e nova senha são obrigatórios."}), 400
        
    try:
        data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        if data.get("purpose") != "password_reset":
            return jsonify({"sucesso": False, "erro": "Token inválido para esta operação."}), 401
            
        usuario_id = data["usuario_id"]
    except jwt.ExpiredSignatureError:
        return jsonify({"sucesso": False, "erro": "O link de recuperação expirou. Solicite um novo."}), 401
    except jwt.InvalidTokenError:
        return jsonify({"sucesso": False, "erro": "Token de recuperação inválido."}), 401
        
    # Hash da nova senha
    senha_hash = generate_password_hash(nova_senha)
    
    conexao = conectar()
    conexao.execute("UPDATE usuarios SET senha = ? WHERE id = ?", (senha_hash, usuario_id))
    conexao.commit()
    conexao.close()
    
    return jsonify({"sucesso": True, "mensagem": "Senha alterada com sucesso! Você já pode fazer login."}), 200


