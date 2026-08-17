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


@clientes_bp.route("/clientes/<int:id>/historico", methods=["GET"])
def historico_cliente(id):
    conexao = conectar()

    # Busca o último agendamento (concluído) desse cliente
    ultimo_agendamento = conexao.execute("""
        SELECT a.data, s.nome as servico
        FROM agendamentos a
        JOIN servicos s ON a.servico_id = s.id
        WHERE a.cliente_id = ? AND a.status = 'concluido'
        ORDER BY a.data DESC, a.hora DESC
        LIMIT 1
    """, (id,)).fetchone()

    conexao.close()

    if ultimo_agendamento:
        return jsonify({
            "tem_historico": True,
            "data_ultima_visita": ultimo_agendamento["data"],
            "servico_ultima_visita": ultimo_agendamento["servico"]
        })
    else:
        return jsonify({
            "tem_historico": False
        })


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

# Buscar clientes ausentes (retenção)
@clientes_bp.route("/clientes/ausentes", methods=["GET"])
def clientes_ausentes():
    conexao = conectar()
    
    # Busca clientes cujo último agendamento foi há mais de 30 dias
    clientes = conexao.execute("""
        SELECT c.id, c.nome, c.telefone, MAX(a.data) as ultima_visita
        FROM clientes c
        JOIN agendamentos a ON c.id = a.cliente_id
        WHERE a.status = 'concluido'
        GROUP BY c.id, c.nome, c.telefone
        HAVING date(ultima_visita) <= date('now', '-30 days')
        ORDER BY ultima_visita ASC
        LIMIT 5
    """).fetchall()
    
    conexao.close()
    
    return jsonify([dict(cliente) for cliente in clientes])
