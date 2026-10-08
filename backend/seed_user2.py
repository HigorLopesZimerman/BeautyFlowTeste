import sqlite3
from datetime import datetime, timedelta
import random
import calendar
from werkzeug.security import generate_password_hash

DATABASE = "beautyflow.db"

def conectar():
    return sqlite3.connect(DATABASE)

def seed_user2():
    conexao = conectar()
    cursor = conexao.cursor()
    
    usuario_id = 2

    print("[*] Criando usuário 2...")
    senha_hash = generate_password_hash("senha123")
    try:
        cursor.execute("""
            INSERT INTO usuarios (id, nome, email, senha)
            VALUES (?, ?, ?, ?)
        """, (usuario_id, "Usuario Teste 2", "user2@beautyflow.com", senha_hash))
    except sqlite3.IntegrityError:
        print("[*] Usuário 2 já existe. Limpando dados antigos dele...")
        cursor.execute("DELETE FROM pagamentos WHERE usuario_id = ?", (usuario_id,))
        cursor.execute("DELETE FROM agendamentos WHERE usuario_id = ?", (usuario_id,))
        cursor.execute("DELETE FROM clientes WHERE usuario_id = ?", (usuario_id,))
        cursor.execute("DELETE FROM funcionarios WHERE usuario_id = ?", (usuario_id,))
        cursor.execute("DELETE FROM servicos WHERE usuario_id = ?", (usuario_id,))

    print("[*] Gerando Clientes para o Usuário 2...")
    nomes_clientes = [
        "Aline Silva", "Bruno Souza", "Carla Dias", "Daniel Lima", "Eduarda Costa", 
        "Fábio Rocha", "Gabriela Pereira", "Henrique Santos", "Igor Martins", "Júlia Alves"
    ]
    
    clientes_dados = []
    for i, nome in enumerate(nomes_clientes):
        telefone = f"119700{str(1100 + i)}"
        email = f"{nome.split()[0].lower()}@email.com"
        nota = "Mensalista" if i % 3 == 0 else ""
        clientes_dados.append((usuario_id, nome, telefone, email, nota))
        
    cursor.executemany("INSERT INTO clientes (usuario_id, nome, telefone, email, nota) VALUES (?, ?, ?, ?, ?)", clientes_dados)
    
    # Pegar IDs reais dos clientes inseridos
    cursor.execute("SELECT id FROM clientes WHERE usuario_id = ?", (usuario_id,))
    clientes_ids = [row[0] for row in cursor.fetchall()]

    print("[*] Gerando Funcionários para o Usuário 2...")
    funcionarios_dados = [
        (usuario_id, "Joana", "Manicure", "11980010001", "joana@user2.com"),
        (usuario_id, "Pedro", "Cabeleireiro", "11980010002", "pedro@user2.com"),
    ]
    cursor.executemany("INSERT INTO funcionarios (usuario_id, nome, funcao, telefone, email) VALUES (?, ?, ?, ?, ?)", funcionarios_dados)
    
    cursor.execute("SELECT id FROM funcionarios WHERE usuario_id = ?", (usuario_id,))
    func_ids = [row[0] for row in cursor.fetchall()]

    print("[*] Gerando Serviços para o Usuário 2...")
    servicos_dados = [
        (usuario_id, "Corte", 30, 50.00),
        (usuario_id, "Manicure", 45, 30.00),
        (usuario_id, "Pedicure", 45, 35.00),
        (usuario_id, "Pintura", 90, 120.00),
    ]
    cursor.executemany("INSERT INTO servicos (usuario_id, nome, duracao, preco) VALUES (?, ?, ?, ?)", servicos_dados)
    
    cursor.execute("SELECT id, duracao, preco FROM servicos WHERE usuario_id = ?", (usuario_id,))
    servicos_info = cursor.fetchall() # list of tuples (id, duracao, preco)

    print("[*] Gerando Agendamentos para o mês todo (Outubro 2026)...")
    
    # Mês de Outubro de 2026
    ano = 2026
    mes = 10
    dias_no_mes = calendar.monthrange(ano, mes)[1]
    
    agendamentos_dados = []
    pagamentos_dados = []
    
    horarios_disponiveis = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"]
    hoje = datetime.now() # "Hoje" na simulação

    for dia in range(1, dias_no_mes + 1):
        data_obj = datetime(ano, mes, dia)
        data_str = data_obj.strftime("%Y-%m-%d")
        
        # Ignorar domingos
        if data_obj.weekday() == 6:
            continue
            
        # Criar entre 2 e 5 agendamentos por dia
        qtd_agendamentos = random.randint(2, 5)
        horarios_do_dia = random.sample(horarios_disponiveis, qtd_agendamentos)
        
        for hora in horarios_do_dia:
            c_id = random.choice(clientes_ids)
            f_id = random.choice(func_ids)
            s_info = random.choice(servicos_info)
            s_id, duracao, preco = s_info[0], s_info[1], s_info[2]
            
            h, m = map(int, hora.split(':'))
            hora_obj = data_obj.replace(hour=h, minute=m)
            hora_fim_obj = hora_obj + timedelta(minutes=duracao)
            hora_fim = hora_fim_obj.strftime("%H:%M")
            
            # Definir status baseado se a data já passou ou não
            if data_obj < hoje:
                # 90% de chance de ter sido concluido se já passou
                status = "concluido" if random.random() < 0.9 else "cancelado"
            elif data_obj.date() == hoje.date():
                status = random.choice(["agendado", "confirmado", "concluido"])
            else:
                status = random.choice(["agendado", "confirmado"])
                
            cursor.execute("""
                INSERT INTO agendamentos (usuario_id, cliente_id, funcionario_id, servico_id, data, hora, hora_fim, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (usuario_id, c_id, f_id, s_id, data_str, hora, hora_fim, status))
            
            ag_id = cursor.lastrowid
            
            if status == 'concluido':
                forma = random.choice(["Pix", "Cartão de Crédito", "Dinheiro"])
                pagamentos_dados.append((usuario_id, ag_id, preco, forma, 'pago', data_str))

    print("[*] Inserindo registros financeiros (Pagamentos)...")
    cursor.executemany("""
        INSERT INTO pagamentos (usuario_id, agendamento_id, valor, forma_pagamento, status, data_pagamento)
        VALUES (?, ?, ?, ?, ?, ?)
    """, pagamentos_dados)

    conexao.commit()
    conexao.close()
    
    print("\n[OK] Banco de dados populado com sucesso para o Usuário 2!")
    print("   - Email: user2@beautyflow.com / Senha: senha123")
    print(f"   - Agendamentos criados para todo o mês {mes}/{ano}")

if __name__ == "__main__":
    seed_user2()
