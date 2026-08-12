import sqlite3

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
            nome TEXT NOT NULL,
            telefone TEXT NOT NULL,
            email TEXT,
            nota TEXT
        )
    """)
    
    
    # Tabela de Funcionários
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS funcionarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        funcao TEXT NOT NULL,
        telefone TEXT,
        email TEXT
    )
    """)    
    
    # Tabela de serviços
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS servicos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            duracao INTEGER NOT NULL,
            preco REAL NOT NULL
            
        )
    """)
    
    # Tabela de agendamentos
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS agendamentos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,

        cliente_id INTEGER NOT NULL,
        funcionario_id INTEGER NOT NULL,
        servico_id INTEGER NOT NULL,

        data TEXT NOT NULL,
        hora TEXT NOT NULL,

        status TEXT DEFAULT 'agendado',

        FOREIGN KEY (cliente_id)
            REFERENCES clientes(id),

        FOREIGN KEY (funcionario_id)
            REFERENCES funcionarios(id),

        FOREIGN KEY (servico_id)
            REFERENCES servicos(id)
    )
    """)
    
    
    # Tabela de pagamentos
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS pagamentos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            agendamento_id INTEGER NOT NULL,
            valor REAL NOT NULL,
            forma_pagamento TEXT NOT NULL,
            status TEXT DEFAULT 'pendente',
            data_pagamento TEXT NOT NULL,
            
            
            FOREIGN KEY (agendamento_id)
                REFERENCES agendamentos(id)
        )
    """)
    
    
    
    
    try:
        cursor.execute("ALTER TABLE clientes ADD COLUMN nota TEXT")
    except sqlite3.OperationalError:
        pass # A coluna já existe

    conexao.commit()
    conexao.close()
    
    print("Banco de dados criado com sucesso!")
    
if __name__ == "__main__":
    criar_banco()