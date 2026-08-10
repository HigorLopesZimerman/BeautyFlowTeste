from database import conectar, criar_banco

criar_banco()

conexao = conectar()
cursor = conexao.cursor()

existe = cursor.execute("""
    SELECT COUNT(*)
    FROM clientes
""").fetchone()[0]

if existe > 0:
    print("Banco já possui dados.")
    conexao.close()
    exit()


clientes = [
    ("João Silva", "18999990001", "joao@email.com"),
    ("Maria Oliveira", "18999990002", "maria@email.com"),
    ("Pedro Santos", "18999990003", "pedro@email.com")
]

cursor.executemany("""
    INSERT INTO clientes (nome, telefone, email)
    VALUES (?, ?, ?)
""", clientes)


funcionarios = [
    ("Carlos Souza", "Cabeleireiro", "18988880001", "carlos@email.com"),
    ("Ana Lima", "Manicure", "18988880002", "ana@email.com")
]

cursor.executemany("""
    INSERT INTO funcionarios (nome, funcao, telefone, email)
    VALUES (?, ?, ?, ?)
""", funcionarios)


servicos = [
    ("Corte Masculino", 45, 50),
    ("Corte Feminino", 60, 80),
    ("Manicure", 30, 40)
]

cursor.executemany("""
    INSERT INTO servicos (nome, duracao, preco)
    VALUES (?, ?, ?)
""", servicos)

agendamentos = [
    (1, 1, 1, "2026-08-01", "09:00", "agendado"),
    (2, 2, 2, "2026-08-01", "10:30", "agendado"),
    (3, 1, 3, "2026-08-01", "14:00", "concluido"),
    (1, 2, 2, "2026-08-02", "09:30", "agendado"),
    (2, 1, 1, "2026-08-02", "15:00", "cancelado")
]

cursor.executemany("""
    INSERT INTO agendamentos (
        cliente_id,
        funcionario_id,
        servico_id,
        data,
        hora,
        status
    )
    VALUES (?, ?, ?, ?, ?, ?)
""", agendamentos)


pagamentos = [
    (1, 50, "Pix", "pago", "2026-08-01"),
    (2, 80, "Cartão", "pendente", "2026-08-01"),
    (3, 40, "Dinheiro", "pago", "2026-08-01"),
    (4, 80, "Pix", "pendente", "2026-08-02"),
    (5, 50, "Cartão", "pago", "2026-08-02")
]

cursor.executemany("""
    INSERT INTO pagamentos (
        agendamento_id,
        valor,
        forma_pagamento,
        status,
        data_pagamento
    )
    VALUES (?, ?, ?, ?, ?)
""", pagamentos)

conexao.commit()
conexao.close()

print("Banco populado com sucesso!")