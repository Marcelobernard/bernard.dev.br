import requests
import json
import concurrent.futures
import time

# Função para pegar os preços baseados nas ofertas do mercado para um item
def get_item_price(item_name):
    url = f"https://api.warframe.market/v1/items/{item_name}/orders"
    
    # Fazendo a requisição para pegar as ofertas do item
    response = requests.get(url)
    
    if response.status_code == 200:
        data = response.json()
        if 'payload' in data and 'orders' in data['payload']:
            # Filtrando as ofertas de venda e comprando os preços mínimo, máximo e médio
            orders = data['payload']['orders']
            
            # Preços das ofertas de venda
            sell_orders = [order for order in orders if order['order_type'] == 'sell']
            
            if not sell_orders:
                print(f"[FALHA] Item {item_name}: Não há ofertas de venda disponíveis.")
                return None

            avg_price = sum(order['platinum'] for order in sell_orders) / len(sell_orders)
            min_price = min(order['platinum'] for order in sell_orders)
            max_price = max(order['platinum'] for order in sell_orders)
            
            return {
                'avg_price': avg_price,
                'min_price': min_price,
                'max_price': max_price
            }
        else:
            print(f"[FALHA] Item {item_name}: Não foram encontradas ofertas.")
            return None
    elif response.status_code == 404:
        print(f"[FALHA] Item {item_name}: Item não encontrado (Status Code 404).")
        return None
    else:
        print(f"[FALHA] Item {item_name}: Erro na requisição. Status Code: {response.status_code}")
        return None

# Função para processar um único item, incluindo tentativas de falhas
def process_item(item, failed_items):
    item_name = item.get('url_name')
    attempts = 0

    while attempts < 20:
        if item_name:
            price_data = get_item_price(item_name)
            
            if price_data:
                item['avg_price'] = price_data['avg_price']
                item['min_price'] = price_data['min_price']
                item['max_price'] = price_data['max_price']
                print(f"[SUCESSO] Item {item['item_name']} ({item['url_name']}): Preços carregados com sucesso!")
                break
            else:
                item['avg_price'] = None
                item['min_price'] = None
                item['max_price'] = None
                print(f"[FALHA] Item {item['item_name']} ({item['url_name']}): Não foi possível carregar os preços.")
                attempts += 1
                time.sleep(1)  # Espera 1 segundo antes de tentar novamente
        else:
            break

    # Se falhou mais de 20 vezes, o item é adicionado à lista de falhas
    if attempts >= 20:
        print(f"[IGNORADO] Item {item['item_name']} ({item['url_name']}): Falhou 20 vezes, ignorado.")
        failed_items.append(item)
    
    return item

# Carregar os itens a partir do arquivo JSON
with open('warframe_items.json', 'r') as file:
    items = json.load(file)

# Lista para armazenar itens que falharam mais de 20 vezes
failed_items = []

# Usando ThreadPoolExecutor para processar múltiplos itens em paralelo
with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
    # Usando map para aplicar a função process_item a cada item
    enriched_items = list(executor.map(lambda item: process_item(item, failed_items), items))

# Salvando o JSON com todos os itens enriquecidos
with open('w1arframe_items_with_prices.json', 'w') as file:
    json.dump(enriched_items, file, indent=4)

# Salvando os itens que falharam 20 vezes
with open('failed_items.json', 'w') as file:
    json.dump(failed_items, file, indent=4)

print("Arquivo JSON gerado com sucesso com os preços!")