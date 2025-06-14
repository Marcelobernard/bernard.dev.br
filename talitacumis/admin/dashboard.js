// Classe para representar um item do cardápio
class ItemCardapio {
    constructor(id, nomePT, nomeES, precoRS, precoGuarani, categoria) {
        this.id = id;
        this.nomePT = nomePT;
        this.nomeES = nomeES;
        this.precoRS = precoRS;
        this.precoGuarani = precoGuarani;
        this.categoria = categoria;
    }
}

let idEdicaoAtual = null; // controle global de edição

// Gerenciador do cardápio
class CardapioManager {
    constructor() {
        this.apiUrl = 'https://xgjheq2p0a.execute-api.sa-east-1.amazonaws.com/items';
        this.itens = [];
        this.carregarItens();
    }

    async carregarItens() {
        try {
            const response = await fetch(this.apiUrl);
            if (!response.ok) throw new Error(`Erro ao carregar itens: ${response.status} ${response.statusText}`);
            
            const data = await response.json();
            this.itens = data;
            this.atualizarGrid();
        } catch (error) {
            console.error('Erro ao carregar itens do cardápio:', error);
            alert('Erro ao carregar itens do cardápio: ' + error.message);
        }
    }

    async adicionarItem(item) {
        // Evita duplicatas exatas
        const itemExistente = this.itens.find(i =>
            i.nomePT === item.nomePT &&
            i.nomeES === item.nomeES &&
            parseFloat(i.precoRS) === parseFloat(item.precoRS) &&
            parseInt(i.precoGuarani) === parseInt(item.precoGuarani) &&
            i.categoria === item.categoria
        );
        if (itemExistente) {
            alert('Este item já existe no cardápio.');
            return;
        }

        try {            
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(item)
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Resposta de erro:', errorText);
                throw new Error(`Erro ao adicionar item: ${response.status} ${response.statusText}\n${errorText}`);
            }

            const data = await response.json();
            item.id = data.id;
            this.itens.push(item);
            this.atualizarGrid();
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
        const response = await fetch(`${this.apiUrl}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(novosDados)
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Resposta de erro:', errorText);
            throw new Error(`Erro ao editar item: ${response.status} ${response.statusText}\n${errorText}`);
        }
        
        await this.carregarItens();
    }

    async excluirItem(id) {
        try {
            // Garante que o ID seja tratado como parâmetro na URL
            const url = `${this.apiUrl}/${id}`;
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Resposta de erro:', errorText);
                throw new Error(`Erro ao excluir item: ${response.status} ${response.statusText}\n${errorText}`);
            }

            this.itens = this.itens.filter(item => item.id !== id);
            this.atualizarGrid();
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
                    if (item.id) {
                        await this.editarItem(item.id, item); // atualiza se já tem ID
                    } else {
                        await this.adicionarItem(item); // adiciona se for novo
                    }
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
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <div>
                    <div style="font-weight: 500; color: var(--cor-primaria);">${item.nomePT}</div>
                    <div style="font-size: 0.9rem; color: var(--cor-secundaria);">${item.nomeES}</div>
                </div>
            </td>
            <td style="color: var(--cor-secundaria);">R$ ${parseFloat(item.precoRS).toFixed(2)}</td>
            <td style="color: var(--cor-secundaria);">${parseInt(item.precoGuarani).toLocaleString()} Gs</td>
            <td style="color: var(--cor-secundaria);">${item.categoria}</td>
            <td>
                <div class="item-actions">
                    <button class="action-btn edit-btn" onclick="cardapioManager.abrirModalEditar('${item.id}')" title="Editar item">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete-btn" onclick="abrirConfirmModal('${item.id}')" title="Excluir item">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        return tr;
    }

    atualizarGrid() {
        const tbody = document.querySelector('.cardapio-table tbody');
        if (!tbody) {
            console.error('Elemento tbody não encontrado');
            return;
        }

        // Limpa o tbody
        tbody.innerHTML = '';

        // Adiciona os itens do cardápio
        this.itens.forEach(item => {
            const tr = this.criarGridItem(item);
            tbody.appendChild(tr);
        });
    }

    abrirModalEditar(id) {
        idEdicaoAtual = id;
        const item = this.itens.find(item => item.id === id);
        const form = document.getElementById('itemForm');
        
        form.nomePT.value = item.nomePT;
        form.nomeES.value = item.nomeES;
        form.precoRS.value = item.precoRS;
        form.precoGuarani.value = item.precoGuarani;
        form.categoria.value = item.categoria;

        document.getElementById('itemModal').style.display = 'flex';
    }

    fecharModal() {
        idEdicaoAtual = null;
        document.getElementById('itemModal').style.display = 'none';
    }
}

// Inicialização
const cardapioManager = new CardapioManager();

// Manipulação do formulário
document.getElementById('itemForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    
    // Validação dos dados
    const dados = {
        nomePT: formData.get('nomePT').trim(),
        nomeES: formData.get('nomeES').trim(),
        precoRS: parseFloat(formData.get('precoRS')),
        precoGuarani: parseInt(formData.get('precoGuarani')),
        categoria: formData.get('categoria')
    };

    // Validações
    if (!dados.nomePT || !dados.nomeES) {
        alert('Os nomes em português e espanhol são obrigatórios');
        return;
    }

    if (isNaN(dados.precoRS) || dados.precoRS <= 0) {
        alert('O preço em Reais deve ser um valor válido maior que zero');
        return;
    }

    if (isNaN(dados.precoGuarani) || dados.precoGuarani <= 0) {
        alert('O preço em Guarani deve ser um valor válido maior que zero');
        return;
    }

    if (!dados.categoria) {
        alert('A categoria é obrigatória');
        return;
    }

    try {
        if (idEdicaoAtual) {            // Se estiver editando, atualiza o item existente mantendo o ID original
            await cardapioManager.editarItem(idEdicaoAtual, dados);
            idEdicaoAtual = null; // Reseta o ID de edição
        } else {            // Se não estiver editando, adiciona um novo item
            await cardapioManager.adicionarItem(dados);
        }
        fecharModal();
    } catch (error) {
        console.error('Erro ao processar formulário:', error);
        alert('Erro ao salvar item: ' + error.message);
    }
});

// Funções do modal
function abrirModalAdicionar() {
    idEdicaoAtual = null; // Garante que não está em modo de edição
    const modal = document.getElementById('itemModal');
    const form = document.getElementById('itemForm');
    const modalTitle = modal.querySelector('.modal-title');

    modalTitle.textContent = 'Adicionar Item';
    form.reset();
    modal.style.display = 'flex';
}

// Funções extra
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

// Fecha modal ao clicar fora
window.onclick = function(event) {
    const modal = document.getElementById('itemModal');
    if (event.target === modal) {
        fecharModal();
    }
}