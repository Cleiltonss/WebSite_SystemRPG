from app import db, Equipment, app  # Reutiliza o banco de dados e o modelo do seu app

def clear_all_equipments():
    """Remove todos os equipamentos do banco de dados."""
    with app.app_context():  # Garante que estamos no contexto do Flask
        db.session.query(Equipment).delete()  # Remove todos os registros da tabela Equipment
        db.session.commit()
        print("Todos os equipamentos foram removidos com sucesso!")

if __name__ == "__main__":
    clear_all_equipments()
