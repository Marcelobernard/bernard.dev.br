import requests
import json

# Definindo a URL da API para pegar todos os itens
url = "https://api.warframe.market/v1/items"

# Fazendo a requisição para a API
response = requests.get(url)

# Verificando se a requisição foi bem-sucedida
if response.status_code == 200:
    data = response.json()
    items = data.get('payload', {}).get('items', [])
    
    # Gerando o JSON com todos os itens
    with open('warframe_items.json', 'w') as file:
        json.dump(items, file, indent=4)
    
    print("Arquivo JSON gerado com sucesso!")
else:
    print(f"Erro ao acessar a API: {response.status_code}")
