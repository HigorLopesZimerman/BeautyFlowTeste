import sqlite3
from werkzeug.security import generate_password_hash

DATABASE = "beautyflow.db"

def conectar():
    conexao = sqlite3.connect(DATABASE)
    conexao.row_factory = sqlite3.Row
    return conexao

def criar_banco():
    conexao = conectar()
    cursor = conexao.cursor()
    
    # Tabela de clientes
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS clientes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario_id INTEGER NOT NULL,
            nome TEXT NOT NULL,
            telefone TEXT NOT NULL,
            email TEXT,
            nota TEXT,
            FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
        )
    """)
    
    
    # Tabela de Funcionários
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS funcionarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario_id INTEGER NOT NULL,
        nome TEXT NOT NULL,
        funcao TEXT NOT NULL,
        telefone TEXT,
        email TEXT,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    )
    """)    
    
    # Tabela de serviços
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS servicos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario_id INTEGER NOT NULL,
            nome TEXT NOT NULL,
            duracao INTEGER NOT NULL,
            preco REAL NOT NULL,
            FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
        )
    """)
    
    # Tabela de agendamentos
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS agendamentos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario_id INTEGER NOT NULL,
        
        cliente_id INTEGER NOT NULL,
        funcionario_id INTEGER NOT NULL,
        servico_id INTEGER NOT NULL,
        
        data TEXT NOT NULL,
        hora TEXT NOT NULL,
        hora_fim TEXT,
        
        status TEXT DEFAULT 'agendado',
        
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
        FOREIGN KEY (cliente_id) REFERENCES clientes(id),
        FOREIGN KEY (funcionario_id) REFERENCES funcionarios(id),
        FOREIGN KEY (servico_id) REFERENCES servicos(id)
    )
    """)
    
    
    # Tabela de pagamentos
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS pagamentos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario_id INTEGER NOT NULL,
            agendamento_id INTEGER NOT NULL,
            valor REAL NOT NULL,
            forma_pagamento TEXT NOT NULL,
            status TEXT DEFAULT 'pendente',
            data_pagamento TEXT NOT NULL,
            
            FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
            FOREIGN KEY (agendamento_id) REFERENCES agendamentos(id)
        )
    """)
    
    # Tabela de Usuários
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            senha TEXT NOT NULL
        )
    """)
    
    try:
        cursor.execute("ALTER TABLE clientes ADD COLUMN nota TEXT")
    except sqlite3.OperationalError:
        pass # A coluna já existe

    try:
        cursor.execute("ALTER TABLE agendamentos ADD COLUMN hora_fim TEXT")
    except sqlite3.OperationalError:
        pass # A coluna já existe

    # Migrações para Multi-Tenant (usuario_id)
    # Por padrão, associaremos os dados existentes ao Admin (id 1) para preservar tudo
    tabelas_tenant = ['clientes', 'funcionarios', 'servicos', 'agendamentos', 'pagamentos']
    for tabela in tabelas_tenant:
        try:
            cursor.execute(f"ALTER TABLE {tabela} ADD COLUMN usuario_id INTEGER NOT NULL DEFAULT 1 REFERENCES usuarios(id)")
        except sqlite3.OperationalError:
            pass # A coluna já existe

    # Inserir administrador padrão caso não haja usuários
    cursor.execute("SELECT COUNT(*) FROM usuarios")
    if cursor.fetchone()[0] == 0:
        senha_hash = generate_password_hash("admin123")
        cursor.execute("""
            INSERT INTO usuarios (nome, email, senha)
            VALUES (?, ?, ?)
        """, ("Administrador", "admin@beautyflow.com", senha_hash))

    conexao.commit()
    conexao.close()
    
    print("Banco de dados criado com sucesso!")
    
if __name__ == "__main__":
    criar_banco()