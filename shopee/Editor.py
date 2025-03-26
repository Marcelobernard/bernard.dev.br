import tkinter as tk
from tkinter import messagebox, simpledialog
import json

def load_products():
    try:
        with open('produtos.json', 'r') as file:
            return json.load(file)
    except FileNotFoundError:
        return []

def save_products(products):
    with open('produtos.json', 'w') as file:
        json.dump(products, file, indent=4)

def show_products(page=1, search_query=""):
    products = load_products()
    filtered_products = [p for p in products if search_query.lower() in p['nome'].lower()]
    products_per_page = 5
    start = (page - 1) * products_per_page
    end = start + products_per_page
    
    for widget in frame_list.winfo_children():
        widget.destroy()
    
    for product in filtered_products[start:end]:
        button = tk.Button(frame_list, text=product['nome'], command=lambda p=product: show_product_details(p), 
                           font=('Arial', 14, 'bold'), relief="solid", bd=1, 
                           width=35, height=2, anchor='w', justify='left', padx=10, pady=5)
        button.pack(fill='x', padx=10, pady=5, ipadx=10)
    
    update_pagination(page, len(filtered_products), products_per_page)

def show_product_details(product):
    details_window = tk.Toplevel(root)
    details_window.title(f"Detalhes de {product['nome']}")
    details_window.config(bg="#f0f0f0")

    tk.Label(details_window, text="Nome:", font=("Arial", 14, "bold"), bg="#f0f0f0", fg="#333").pack(pady=5)
    tk.Label(details_window, text=product['nome'], font=("Arial", 12), bg="#f0f0f0", fg="#333").pack(pady=5, fill="x", padx=10)

    tk.Label(details_window, text="Descrição:", font=("Arial", 14, "bold"), bg="#f0f0f0", fg="#333").pack(pady=5)
    tk.Label(details_window, text=product['descricao'], font=("Arial", 12), bg="#f0f0f0", fg="#333").pack(pady=5, fill="x", padx=10)

    tk.Label(details_window, text="Imagem:", font=("Arial", 14, "bold"), bg="#f0f0f0", fg="#333").pack(pady=5)
    tk.Label(details_window, text=product['imagem'], font=("Arial", 12), bg="#f0f0f0", fg="#333").pack(pady=5, fill="x", padx=10)

    tk.Label(details_window, text="Link:", font=("Arial", 14, "bold"), bg="#f0f0f0", fg="#333").pack(pady=5)
    tk.Label(details_window, text=product['link'], font=("Arial", 12), bg="#f0f0f0", fg="#333").pack(pady=5, fill="x", padx=10)

    def delete_product():
        confirm = messagebox.askyesno("Deseja apagar?", f"Você deseja apagar o produto {product['nome']}?")
        if confirm:
            confirm_final = messagebox.askyesno("Tem Certeza?", f"Tem certeza que deseja apagar {product['nome']}?")
            if confirm_final:
                products = load_products()
                products = [p for p in products if p != product]
                save_products(products)
                details_window.destroy()
                show_products()

    delete_button = tk.Button(details_window, text="Excluir Produto", command=delete_product, font=("Arial", 12), bg="#e74c3c", fg="#fff")
    delete_button.pack(pady=10)

def add_product():
    new_name = simpledialog.askstring("Adicionar Nome", "Nome do produto:")
    new_desc = simpledialog.askstring("Adicionar Descrição", "Descrição do produto:")
    new_image = simpledialog.askstring("Adicionar Imagem", "Link da imagem:")
    new_link = simpledialog.askstring("Adicionar Link", "Link do produto:")

    if new_name and new_desc and new_image and new_link:
        products = load_products()
        new_product = {
            'nome': new_name,
            'descricao': new_desc,
            'imagem': new_image,
            'link': new_link
        }
        products.insert(0, new_product)
        save_products(products)
        show_products()


def update_pagination(page, total_products, products_per_page):
    total_pages = (total_products // products_per_page) + (1 if total_products % products_per_page > 0 else 0)
    
    for widget in frame_pagination.winfo_children():
        widget.destroy()
    
    if page > 1:
        prev_button = tk.Button(frame_pagination, text="Anterior", command=lambda: show_products(page-1), font=("Arial", 12), bg="#47ba00", fg="#fff", relief="flat", bd=0)
        prev_button.pack(side="left", padx=10)
    
    if page < total_pages:
        next_button = tk.Button(frame_pagination, text="Próximo", command=lambda: show_products(page+1), font=("Arial", 12), bg="#47ba00", fg="#fff", relief="flat", bd=0)
        next_button.pack(side="right", padx=10)

def search_products():
    search_query = search_entry.get()
    show_products(page=1, search_query=search_query)

root = tk.Tk()
root.title("Gerenciador de Produtos")
root.state('normal')
root.config(bg="#f0f0f0")

frame_list = tk.Frame(root, bg="#f0f0f0")
frame_list.pack(padx=20, pady=20, fill="both", expand=True)

frame_pagination = tk.Frame(root, bg="#f0f0f0")
frame_pagination.pack(pady=10)

search_label = tk.Label(root, text="Buscar Produto:", font=("Arial", 14, "bold"), bg="#f0f0f0", fg="#333")
search_label.pack(pady=5)
search_entry = tk.Entry(root, font=("Arial", 12), width=35)
search_entry.pack(pady=5)
search_button = tk.Button(root, text="Buscar", command=search_products, font=("Arial", 12), bg="#47ba00", fg="#fff", relief="flat", bd=0)
search_button.pack(pady=10)

add_button = tk.Button(root, text="Adicionar Produto", command=add_product, font=("Arial", 14), bg="#47ba00", fg="#fff", relief="flat", bd=0, width=20, height=2)
add_button.pack(pady=20)

show_products()

root.mainloop()
