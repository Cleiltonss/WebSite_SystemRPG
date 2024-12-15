from app import db, Equipment, app # Reutiliza o banco e o modelo do app

def add_equipment(image_path, name, description):
    with app.app_context():
        """Adiciona um novo equipamento ao banco de dados."""
        new_equipment = Equipment(image_path=image_path, name=name, description=description)
        db.session.add(new_equipment)
        db.session.commit()
        print(f"Equipamento '{name}' adicionado com sucesso!")

if __name__ == "__main__":
    # Edite aqui para adicionar novos equipamentos
    equipments = [
        {
            "image_path": "/static/images_pEquipment/kukri.png",
            "name": "Katana",
            "description": "DSDSSSD.",
        },
        # {
        #     "image_path": "/static/images_pEquipment/axe.png",
        #     "name": "Machado",
        #     "description": "Um machado robusto e destrutivo, ideal para combates corpo a corpo.",
        # },
    ]

    # Adiciona cada equipamento ao banco de dados
    for equipment in equipments:
        add_equipment(equipment["image_path"], equipment["name"], equipment["description"])
