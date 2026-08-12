from database import conectar, criar_banco

criar_banco()

conexao = conectar()
cursor = conexao.cursor()

# Limpar tabelas existentes para garantir que o seed sempre rode com dados limpos
print("Limpando banco de dados...")
cursor.execute("DELETE FROM pagamentos")
cursor.execute("DELETE FROM agendamentos")
cursor.execute("DELETE FROM servicos")
cursor.execute("DELETE FROM funcionarios")
cursor.execute("DELETE FROM clientes")

# Zerar contadores de auto incremento
cursor.execute("DELETE FROM sqlite_sequence")

print("Inserindo novos dados...")

clientes = [
    ("João Silva", "18999990001", "joao@email.com", "Cliente antigo, gosta de conversar"),
    ("Maria Oliveira", "18999990002", "maria@email.com", "Irmã da Joana"),
    ("Pedro Santos", "18999990003", "pedro@email.com", ""),
    ("Ana Clara", "18999990004", "ana.clara@email.com", "Sempre atrasa 5 minutos"),
    ("Lucas Mendes", "18999990005", "lucas.m@email.com", "Prefere horário da manhã"),
    ("Juliana Costa", "18999990006", "juli@email.com", ""),
    ("Roberto Alves", "18999990007", "beto@email.com", "Mora longe, confirmar presença"),
    ("Camila Souza", "18999990008", "mila@email.com", ""),
    ("Fernanda Lima", "18999990009", "fer.lima@email.com", "Alergia a esmalte vermelho"),
    ("Bruno Gomes", "18999990010", "bruno.g@email.com", "")
]

cursor.executemany("""
    INSERT INTO clientes (nome, telefone, email, nota)
    VALUES (?, ?, ?, ?)
""", clientes)


funcionarios = [
    ("Carlos Souza", "Cabeleireiro", "18988880001", "carlos@email.com"),
    ("Ana Lima", "Manicure", "18988880002", "ana@email.com"),
    ("Roberto Dias", "Barbeiro", "18988880003", "roberto@email.com"),
    ("Julia Paz", "Esteticista", "18988880004", "julia@email.com")
]

cursor.executemany("""
    INSERT INTO funcionarios (nome, funcao, telefone, email)
    VALUES (?, ?, ?, ?)
""", funcionarios)


servicos = [
    ("Corte Masculino", 45, 50),
    ("Corte Feminino", 60, 80),
    ("Manicure", 30, 40),
    ("Pedicure", 30, 45),
    ("Limpeza de Pele", 90, 120),
    ("Barba", 30, 35)
]

cursor.executemany("""
    INSERT INTO servicos (nome, duracao, preco)
    VALUES (?, ?, ?)
""", servicos)

# Simulando uma agenda cheia (15 agendamentos)
# Hoje é 2026-08-11 no ambiente simulado, vamos criar dados próximos a essa data
agendamentos = [
    (1, 1, 1, "2026-08-11", "09:00", "agendado"),
    (2, 2, 3, "2026-08-11", "09:30", "agendado"),
    (3, 3, 6, "2026-08-11", "10:00", "concluido"),
    (4, 4, 5, "2026-08-11", "10:30", "agendado"),
    (5, 1, 2, "2026-08-11", "11:00", "agendado"),
    (6, 2, 4, "2026-08-11", "13:00", "agendado"),
    (7, 3, 1, "2026-08-11", "14:00", "cancelado"),
    (8, 4, 5, "2026-08-11", "15:00", "agendado"),
    (9, 1, 2, "2026-08-11", "16:00", "agendado"),
    (10, 2, 3, "2026-08-12", "09:00", "agendado"),
    (1, 3, 6, "2026-08-12", "10:00", "agendado"),
    (2, 4, 5, "2026-08-12", "11:00", "agendado"),
    (3, 1, 1, "2026-08-12", "13:30", "agendado"),
    (4, 2, 4, "2026-08-12", "15:00", "agendado"),
    (5, 3, 1, "2026-08-12", "16:30", "agendado")
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
    (1, 50, "Pix", "pendente", "2026-08-11"),
    (2, 40, "Cartão", "pago", "2026-08-11"),
    (3, 35, "Dinheiro", "pago", "2026-08-11"),
    (4, 120, "Pix", "pendente", "2026-08-11"),
    (5, 80, "Cartão", "pendente", "2026-08-11"),
    (6, 45, "Pix", "pendente", "2026-08-11"),
    (7, 50, "Dinheiro", "cancelado", "2026-08-11"),
    (8, 120, "Cartão", "pendente", "2026-08-11"),
    (9, 80, "Pix", "pendente", "2026-08-11"),
    (10, 40, "Cartão", "pendente", "2026-08-12"),
    (11, 35, "Dinheiro", "pendente", "2026-08-12"),
    (12, 120, "Pix", "pendente", "2026-08-12"),
    (13, 50, "Cartão", "pendente", "2026-08-12"),
    (14, 45, "Pix", "pendente", "2026-08-12"),
    (15, 50, "Dinheiro", "pendente", "2026-08-12")
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

print("Banco populado com sucesso (Agenda Completa)!")