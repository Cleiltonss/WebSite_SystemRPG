from app import db, Equipment, app

def add_equipment(category, nameCategory, image_path, name, description):
    """Adiciona um novo equipamento ao banco de dados."""
    with app.app_context():
        new_equipment = Equipment(
            category=category,
            nameCategory=nameCategory,
            image_path=image_path,
            name=name,
            description=description
        )
        db.session.add(new_equipment)
        db.session.commit()
        print(f"Equipamento '{name}' adicionado com sucesso na subcategoria '{nameCategory}'!")

if __name__ == "__main__":
    # Exemplo de equipamentos

    """
    ARMAS

    nameCategory = {Lâminas
                Machados/Martelos/Maças
                Lanças/Bastões
                Arcos/Bestas
                Armas de Fogo
                Chicotes/Correntes e Afins}
    """



    """
    ARMADURAS

    nameCategory = {Armaduras Leves
                    }
    """
    

    equipments = [
        # Armas
        {
            "category": "Armas",
            "nameCategory": "Lâminas",
            "image_path": "/static/images_pEquipment/kukri.png",
            "name": "Kukri",
            "description": "Uma faca dobrada comumente usada pelos gurkhas das montanhas distantes."
            
        },
        {
            "category": "Armas",
            "nameCategory": "Machados/Martelos/Maças",
            "image_path": "/static/images_pEquipment/machado.png",
            "name": "Machado",
            "description": "Ferramenta de corte que é construída com uma cunha fixada perpendicularmente a um cabo de madeira ou metal"
            
        },


        # Armaduras e Vestimentas
        {
            "category": "Armaduras e Vestimentas",
            "nameCategory": "Armadura Leve",
            "image_path": "/static/images_pEquipment/linothorax.jpg",
            "name": "Linothorax",
            "description": "Peitoral feito de linho com juntas de couro e um saiote em camadas para proteção"
            
        },
        
    ]

    # Adiciona cada equipamento ao banco de dados
    for equipment in equipments:
        add_equipment(
            equipment["category"],
            equipment["nameCategory"],
            equipment["image_path"],
            equipment["name"],
            equipment["description"]
        )