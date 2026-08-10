from flask import Flask
from flask_cors import CORS
from database import criar_banco

from database import criar_banco
from routes.clientes import clientes_bp
from routes.funcionarios import funcionarios_bp
from routes.servicos import servicos_bp
from routes.agendamentos import agendamentos_bp
from routes.pagamentos import pagamentos_bp
from routes.dashboard import dashboard_bp
from routes.relatorios import relatorios_bp

app = Flask(__name__)
CORS(app)

criar_banco()


app.register_blueprint(clientes_bp)
app.register_blueprint(funcionarios_bp)
app.register_blueprint(servicos_bp)
app.register_blueprint(agendamentos_bp)
app.register_blueprint(pagamentos_bp)
app.register_blueprint(dashboard_bp)
app.register_blueprint(relatorios_bp)

# Rota principal
@app.route("/")
def inicio():
    return {
        "sistema": "BeautyFlow",
        "status": "online"
    }


# ==================== SERVIDOR ====================

if __name__ == "__main__":
    app.run(debug=True)