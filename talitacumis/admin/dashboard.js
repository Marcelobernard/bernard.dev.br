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
        this.apiUrl = 'https://xgjheq2p0a.execute-api.sa-east-1.amazonaws.com/items';
        this.itens = [];
        this.carregarItens();
    }

    async carregarItens() {
        try {
            console.log('Iniciando carregamento dos itens...');
            const response = await fetch(this.apiUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            
            console.log('Resposta da API:', response);
            
            if (!response.ok) {
                throw new Error(`Erro ao carregar itens: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log('Dados recebidos:', data);
            
            this.itens = Array.isArray(data) ? data : [];
            this.atualizarGrid();
        } catch (error) {
            console.error('Erro ao carregar itens:', error);
            alert('Erro ao carregar itens do cardápio: ' + error.message);
        }
    }

    async adicionarItem(item) {
        try {
            console.log('Adicionando item:', item);
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(item)
            });

            console.log('Resposta da API:', response);
            
            if (!response.ok) {
                throw new Error(`Erro ao adicionar item: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log('Dados recebidos:', data);
            
            item.id = data.id;
            this.itens.push(item);
            this.atualizarGrid();
            alert('Item adicionado com sucesso!');
        } catch (error) {
            console.error('Erro ao adicionar item:', error);
            alert('Erro ao adicionar item ao cardápio: ' + error.message);
        }
    }

    async editarItem(id, novosDados) {
        try {
            console.log('Editando item:', id, novosDados);
            const response = await fetch(`${this.apiUrl}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(novosDados)
            });

            console.log('Resposta da API:', response);
            
            if (!response.ok) {
                throw new Error(`Erro ao editar item: ${response.status} ${response.statusText}`);
            }

            const index = this.itens.findIndex(item => item.id === id);
            if (index !== -1) {
                this.itens[index] = { ...this.itens[index], ...novosDados };
                this.atualizarGrid();
                alert('Item atualizado com sucesso!');
            }
        } catch (error) {
            console.error('Erro ao editar item:', error);
            alert('Erro ao atualizar item do cardápio: ' + error.message);
        }
    }

    async excluirItem(id) {
        if (!confirm('Tem certeza que deseja excluir este item?')) return;

        try {
            console.log('Excluindo item:', id);
            const response = await fetch(`${this.apiUrl}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json'
                }
            });

            console.log('Resposta da API:', response);
            
            if (!response.ok) {
                throw new Error(`Erro ao excluir item: ${response.status} ${response.statusText}`);
            }

            this.itens = this.itens.filter(item => item.id !== id);
            this.atualizarGrid();
            alert('Item excluído com sucesso!');
        } catch (error) {
            console.error('Erro ao excluir item:', error);
            alert('Erro ao excluir item do cardápio: ' + error.message);
        }
    }

    exportarCardapio() {
        const dataStr = JSON.stringify(this.itens, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = 'cardapio.json';
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    }

    async importarCardapio(file) {
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const itens = JSON.parse(e.target.result);
                for (const item of itens) {
                    await this.adicionarItem(item);
                }
                alert('Cardápio importado com sucesso!');
            } catch (error) {
                console.error('Erro ao importar cardápio:', error);
                alert('Erro ao importar cardápio. Verifique se o arquivo é válido.');
            }
        };
        reader.readAsText(file);
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
        const addItemButton = gridContainer.querySelector('.add-item');
        gridContainer.innerHTML = '';
        gridContainer.appendChild(addItemButton);

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

// Funções de exportação e importação
function exportarCardapio() {
    cardapioManager.exportarCardapio();
}

function importarCardapio() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            cardapioManager.importarCardapio(file);
        }
    };
    input.click();
}

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