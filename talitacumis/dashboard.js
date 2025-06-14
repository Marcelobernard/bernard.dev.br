// Classe para representar um item do cardápio
class ItemCardapio {
    constructor(id, nomePT, nomeES, precoRS, precoGuarani, foto, categoria) {
        this.id = id;
        this.nomePT = nomePT;
        this.nomeES = nomeES;
        this.precoRS = precoRS;
        this.precoGuarani = precoGuarani;
        this.foto = foto;
        this.categoria = categoria;
    }
}

// Gerenciador do cardápio
class CardapioManager {
    constructor() {
        this.baseUrl = 'https://xgjheq2p0a.execute-api.sa-east-1.amazonaws.com';
        this.itens = [];
        this.carregarItens();
    }

    async carregarItens() {
        try {
            console.log('Iniciando carregamento dos itens...');
            console.log('URL da API:', `${this.baseUrl}/items`);
            
            const response = await fetch(`${this.baseUrl}/items`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                mode: 'cors'
            });
            
            console.log('Status da resposta:', response.status);
            console.log('Headers da resposta:', response.headers);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Resposta de erro:', errorText);
                throw new Error(`Erro ao carregar itens: ${response.status} ${response.statusText}\n${errorText}`);
            }
            
            const data = await response.json();
            console.log('Dados recebidos:', data);
            
            this.itens = Array.isArray(data) ? data : [];
            this.atualizarGrid();
        } catch (error) {
            console.error('Erro detalhado:', error);
            if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
                alert('Erro de conexão com a API. Verifique se a API está online e acessível.');
            } else {
                alert('Erro ao carregar itens do cardápio: ' + error.message);
            }
        }
    }

    async adicionarItem(item) {
        try {
            console.log('Adicionando item:', item);
            const response = await fetch(`${this.baseUrl}/items`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                mode: 'cors',
                body: JSON.stringify(item)
            });

            console.log('Status da resposta:', response.status);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Resposta de erro:', errorText);
                throw new Error(`Erro ao adicionar item: ${response.status} ${response.statusText}\n${errorText}`);
            }
            
            const data = await response.json();
            console.log('Dados recebidos:', data);
            
            item.id = data.id;
            this.itens.push(item);
            this.atualizarGrid();
            alert('Item adicionado com sucesso!');
        } catch (error) {
            console.error('Erro detalhado:', error);
            if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
                alert('Erro de conexão com a API. Verifique se a API está online e acessível.');
            } else {
                alert('Erro ao adicionar item ao cardápio: ' + error.message);
            }
        }
    }

    async editarItem(id, novosDados) {
        try {
            console.log('Editando item:', id, novosDados);
            
            // Atualiza o item usando PUT
            const response = await fetch(`${this.baseUrl}/items/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                mode: 'cors',
                body: JSON.stringify({
                    ...novosDados,
                    id: id // Mantém o mesmo ID
                })
            });

            if (!response.ok) {
                throw new Error(`Erro ao atualizar item: ${response.status}`);
            }

            // Atualiza o item na lista local
            const index = this.itens.findIndex(item => item.id === id);
            if (index !== -1) {
                this.itens[index] = { ...novosDados, id: id };
                this.atualizarGrid();
            }

            alert('Item atualizado com sucesso!');
        } catch (error) {
            console.error('Erro detalhado:', error);
            if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
                alert('Erro de conexão com a API. Verifique se a API está online e acessível.');
            } else {
                alert('Erro ao atualizar item do cardápio: ' + error.message);
            }
        }
    }

    async excluirItem(id) {
        if (!confirm('Tem certeza que deseja excluir este item?')) return;

        try {
            console.log('Excluindo item:', id);
            const response = await fetch(`${this.baseUrl}/items/${id}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                mode: 'cors'
            });

            console.log('Status da resposta:', response.status);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Resposta de erro:', errorText);
                throw new Error(`Erro ao excluir item: ${response.status} ${response.statusText}\n${errorText}`);
            }

            this.itens = this.itens.filter(item => item.id !== id);
            this.atualizarGrid();
            alert('Item excluído com sucesso!');
        } catch (error) {
            console.error('Erro detalhado:', error);
            if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
                alert('Erro de conexão com a API. Verifique se a API está online e acessível.');
            } else {
                alert('Erro ao excluir item do cardápio: ' + error.message);
            }
        }
    }

    criarGridItem(item) {
        const gridItem = document.createElement('div');
        gridItem.className = 'grid-item';
        gridItem.innerHTML = `
            <div class="item-actions">
                <button class="action-btn" onclick="cardapioManager.abrirModalEditar('${item.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn" onclick="cardapioManager.excluirItem('${item.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <img src="${item.foto}" alt="${item.nomePT}" style="width: 100px; height: 100px; object-fit: cover; border-radius: 50%; margin-bottom: 1rem;">
            <h3>${item.nomePT}</h3>
            <p>${item.nomeES}</p>
            <p>R$ ${parseFloat(item.precoRS).toFixed(2)}</p>
            <p>${parseInt(item.precoGuarani).toLocaleString()} Gs</p>
            <p><small>${item.categoria}</small></p>
        `;
        return gridItem;
    }

    atualizarGrid() {
        console.log('Atualizando grid com itens:', this.itens);
        const gridContainer = document.querySelector('.grid-container');
        
        // Limpa o grid completamente
        gridContainer.innerHTML = '';
        
        // Adiciona o botão de adicionar item
        const addItemButton = document.createElement('div');
        addItemButton.className = 'grid-item add-item';
        addItemButton.onclick = abrirModalAdicionar;
        addItemButton.innerHTML = `
            <i class="fas fa-plus"></i>
            <span>ADICIONAR ITEM</span>
        `;
        gridContainer.appendChild(addItemButton);

        // Adiciona os itens do cardápio
        this.itens.forEach(item => {
            gridContainer.appendChild(this.criarGridItem(item));
        });
    }

    abrirModalEditar(id) {
        const item = this.itens.find(item => item.id === id);
        if (!item) {
            console.error('Item não encontrado:', id);
            return;
        }

        console.log('Abrindo modal para editar item:', item);
        const modal = document.getElementById('itemModal');
        const form = document.getElementById('itemForm');
        const modalTitle = modal.querySelector('.modal-title');

        modalTitle.textContent = 'Editar Item';
        form.nomePT.value = item.nomePT;
        form.nomeES.value = item.nomeES;
        form.precoRS.value = item.precoRS;
        form.precoGuarani.value = item.precoGuarani;
        form.foto.value = item.foto;
        form.categoria.value = item.categoria;

        form.onsubmit = async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const novosDados = {
                nomePT: formData.get('nomePT'),
                nomeES: formData.get('nomeES'),
                precoRS: parseFloat(formData.get('precoRS')),
                precoGuarani: parseInt(formData.get('precoGuarani')),
                foto: formData.get('foto'),
                categoria: formData.get('categoria')
            };

            await this.editarItem(id, novosDados);
            fecharModal();
        };

        modal.style.display = 'flex';
    }
}

// Inicialização
const cardapioManager = new CardapioManager();

// Manipulação do formulário
document.getElementById('itemForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const item = new ItemCardapio(
        null,
        formData.get('nomePT'),
        formData.get('nomeES'),
        parseFloat(formData.get('precoRS')),
        parseInt(formData.get('precoGuarani')),
        formData.get('foto'),
        formData.get('categoria')
    );

    await cardapioManager.adicionarItem(item);
    fecharModal();
});

// Funções do modal
function abrirModalAdicionar() {
    const modal = document.getElementById('itemModal');
    const form = document.getElementById('itemForm');
    const modalTitle = modal.querySelector('.modal-title');

    modalTitle.textContent = 'Adicionar Item';
    form.reset();
    modal.style.display = 'flex';
}

function fecharModal() {
    const modal = document.getElementById('itemModal');
    modal.style.display = 'none';
}

// Fechar modal ao clicar fora dele
window.onclick = function(event) {
    const modal = document.getElementById('itemModal');
    if (event.target === modal) {
        fecharModal();
    }
} 