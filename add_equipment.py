from app import db, Equipment, app

def add_equipment(image_path, name, description, category):
    """Adiciona um novo equipamento ao banco de dados."""
    with app.app_context():
        new_equipment = Equipment(image_path=image_path, name=name, description=description, category=category)
        db.session.add(new_equipment)
        db.session.commit()
        print(f"Equipamento '{name}' adicionado com sucesso na categoria '{category}'!")

if __name__ == "__main__":
    # Exemplo de equipamentos

    """
    category = {Lâminas
                Machados/Martelos/Maças
                Lanças/Bastões
                Arcos/Bestas
                Armas de Fogo
                Chicotes/Correntes e Afins}
    """
    

    equipments = [
        {
            "category": "Lâminas",
            "image_path": "/static/images_pEquipment/kukri.png",
            "name": "Kukri",
            "description": "Uma faca dobrada comumente usada pelos gurkhas das montanhas distantes."
            
        },
        {
            "category": "Machados/Martelos/Maças",
            "image_path": "/static/images_pEquipment/machado.png",
            "name": "Machado",
            "description": "O machado do Kratos"
            
        },
        
    ]

    # Adiciona cada equipamento ao banco de dados
    for equipment in equipments:
        add_equipment(equipment["image_path"], equipment["name"], equipment["description"], equipment["category"])
