import sqlite3
from datetime import datetime, timedelta
import random
from werkzeug.security import generate_password_hash

DATABASE = "beautyflow.db"

def conectar():
    return sqlite3.connect(DATABASE)

def seed_database():
    conexao = conectar()
    cursor = conexao.cursor()

    print("[*] Limpando dados antigos para recriar com mais volume...")
    cursor.execute("DELETE FROM pagamentos")
    cursor.execute("DELETE FROM agendamentos")
    cursor.execute("DELETE FROM clientes")
    cursor.execute("DELETE FROM funcionarios")
    cursor.execute("DELETE FROM servicos")
    cursor.execute("DELETE FROM usuarios")
    cursor.execute("DELETE FROM sqlite_sequence")

    print("[*] Inserindo usuário administrador...")
    senha_hash = generate_password_hash("admin123")
    cursor.execute("""
        INSERT INTO usuarios (nome, email, senha)
        VALUES (?, ?, ?)
    """, ("Administrador", "admin@beautyflow.com", senha_hash))

    print("[*] Gerando 30 Clientes (vários perfis)...")
    nomes_clientes = [
        "Maria Fernanda", "João Pedro", "Camila Santos", "Lucas Almeida", "Beatriz Lima", 
        "Rafael Souza", "Isabela Rodrigues", "Gustavo Ferreira", "Ana Clara", "Pedro Henrique",
        "Juliana Alves", "Marcos Vinícius", "Fernanda Costa", "Thiago Silva", "Amanda Oliveira",
        "Bruno Rocha", "Letícia Mendes", "Gabriel Martins", "Larissa Ribeiro", "Felipe Cardoso",
        "Carolina Pereira", "Rodrigo Azevedo", "Tatiana Gomes", "Eduardo Dias", "Priscila Moura",
        "Ricardo Faria", "Vanessa Nogueira", "Diego Castro", "Luiza Monteiro", "Marcelo Barros"
    ]
    
    clientes_dados = []
    for i, nome in enumerate(nomes_clientes):
        telefone = f"119800{str(1100 + i)}"
        email = f"{nome.split()[0].lower()}@email.com" if random.random() > 0.3 else ""
        nota = "Cliente VIP" if i % 5 == 0 else ""
        clientes_dados.append((nome, telefone, email, nota))
        
    cursor.executemany("INSERT INTO clientes (nome, telefone, email, nota) VALUES (?, ?, ?, ?)", clientes_dados)
    
    print("[*] Gerando 7 Funcionários (Profissionais)...")
    funcionarios_dados = [
        ("Ana Paula Silva", "Cabeleireira Senior", "11990010001", "ana@beauty.com"),
        ("Marcos Oliveira", "Barbeiro Master", "11990010002", "marcos@beauty.com"),
        ("Juliana Costa", "Manicure/Pedicure", "11990010003", "juliana@beauty.com"),
        ("Roberto Carlos", "Colorista", "11990010004", "roberto@beauty.com"),
        ("Silvia Mendes", "Esteticista", "11990010005", "silvia@beauty.com"),
        ("Paula Fernandes", "Manicure", "11990010006", ""),
        ("Carlos Eduardo", "Barbeiro", "11990010007", ""),
    ]
    cursor.executemany("INSERT INTO funcionarios (nome, funcao, telefone, email) VALUES (?, ?, ?, ?)", funcionarios_dados)

    print("[*] Gerando 12 Serviços...")
    servicos_dados = [
        ("Corte Feminino", 60, 80.00),
        ("Corte Masculino", 30, 45.00),
        ("Coloração", 120, 180.00),
        ("Escova Progressiva", 180, 250.00),
        ("Manicure", 45, 35.00),
        ("Pedicure", 50, 40.00),
        ("Barba Completa", 45, 45.00),
        ("Barba Simples", 30, 35.00),
        ("Hidratação Capilar", 60, 70.00),
        ("Limpeza de Pele", 90, 150.00),
        ("Design de Sobrancelha", 30, 40.00),
        ("Penteado Festa", 90, 180.00),
    ]
    cursor.executemany("INSERT INTO servicos (nome, duracao, preco) VALUES (?, ?, ?)", servicos_dados)

    print("[*] Gerando 80 Agendamentos e seus pagamentos...")
    hoje = datetime.now()
    agendamentos_dados = []
    pagamentos_dados = []
    
    def add_agendamento(c_id, f_id, s_id, data_obj, hora, status):
        data_str = data_obj.strftime("%Y-%m-%d")
        duracao = servicos_dados[s_id-1][1]
        preco = servicos_dados[s_id-1][2]
        
        h, m = map(int, hora.split(':'))
        hora_obj = data_obj.replace(hour=h, minute=m)
        hora_fim_obj = hora_obj + timedelta(minutes=duracao)
        hora_fim = hora_fim_obj.strftime("%H:%M")
        
        cursor.execute("""
            INSERT INTO agendamentos (cliente_id, funcionario_id, servico_id, data, hora, hora_fim, status)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (c_id, f_id, s_id, data_str, hora, hora_fim, status))
        ag_id = cursor.lastrowid
        
        if status == 'concluido':
            forma = random.choice(["Pix", "Cartão de Crédito", "Cartão de Débito", "Dinheiro"])
            pagamentos_dados.append((ag_id, preco, forma, 'pago', data_str))

    horarios_disponiveis = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"]

    # 1. Agendamentos Antigos (Retenção - >30 a 90 dias atrás)
    # Vamos garantir que os clientes do id 20 ao 30 sejam os que estão ausentes!
    for c_id in range(20, 31):
        dias_atras = random.randint(35, 80)
        data_antiga = hoje - timedelta(days=dias_atras)
        add_agendamento(c_id, random.randint(1, 7), random.randint(1, 12), data_antiga, random.choice(horarios_disponiveis), "concluido")

    # 2. Agendamentos Recentes (Últimos 30 dias) - Clientes 1 a 19
    for _ in range(50):
        c_id = random.randint(1, 19)
        f_id = random.randint(1, 7)
        s_id = random.randint(1, 12)
        dias_atras = random.randint(1, 25)
        data_recente = hoje - timedelta(days=dias_atras)
        add_agendamento(c_id, f_id, s_id, data_recente, random.choice(horarios_disponiveis), "concluido")

    # 3. Agendamentos para HOJE (Para deixar o Dashboard bonito!)
    for i in range(5):
        c_id = random.randint(1, 15)
        add_agendamento(c_id, random.randint(1, 7), random.randint(1, 12), hoje, horarios_disponiveis[i], random.choice(["agendado", "confirmado", "concluido"]))

    # 4. Agendamentos para o FUTURO (Próximos 7 dias)
    for _ in range(10):
        c_id = random.randint(1, 30)
        dias_frente = random.randint(1, 7)
        data_futura = hoje + timedelta(days=dias_frente)
        add_agendamento(c_id, random.randint(1, 7), random.randint(1, 12), data_futura, random.choice(horarios_disponiveis), "agendado")

    print("[*] Inserindo registros financeiros (Pagamentos)...")
    cursor.executemany("""
        INSERT INTO pagamentos (agendamento_id, valor, forma_pagamento, status, data_pagamento)
        VALUES (?, ?, ?, ?, ?)
    """, pagamentos_dados)

    conexao.commit()
    conexao.close()
    
    print("\n[OK] Banco de dados populado com sucesso (Versão Robusta para Banca)!")
    print("   - 30 Clientes cadastrados.")
    print("   - 7 Profissionais.")
    print("   - Mais de 80 agendamentos registrados no último trimestre.")
    print("   - 10 clientes marcados propositalmente como Ausentes (+30 dias) para teste da Retenção.")

if __name__ == "__main__":
    seed_database()