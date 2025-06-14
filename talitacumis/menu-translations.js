/**
 * Sistema de Traduções do Menu
 * --------------------------
 * Este arquivo contém todas as traduções utilizadas na interface do cardápio.
 * As traduções são organizadas por idioma e chave de texto.
 * 
 * Estrutura:
 * - Cada idioma é uma chave principal ('pt-BR' ou 'es')
 * - Cada texto tem uma chave única que o identifica
 * - As chaves são organizadas por seção da interface
 * 
 * Uso:
 * Para adicionar uma nova tradução:
 * 1. Adicione a chave em ambos os idiomas
 * 2. Use a chave no HTML com o atributo data-i18n
 * 3. A tradução será aplicada automaticamente ao mudar o idioma
 */

const menuTranslations = {
    'pt-BR': {
        'nav-home': 'Página Principal',
        'nav-menu': 'Cardápio',
        'menu-title': 'Cardápio',
        'menu-coffee': 'Cafés',
        'menu-snacks': 'Salgados',
        'menu-desserts': 'Doces',
        'menu-drinks': 'Bebidas',
        'menu-others': 'Outros',
        'footer-copyright': '© 2024 Talita Cumi\'s. Todos os direitos reservados.'
    },
    'es': {
        'nav-home': 'Página Principal',
        'nav-menu': 'Menú',
        'menu-title': 'Menú',
        'menu-coffee': 'Cafés',
        'menu-snacks': 'Salados',
        'menu-desserts': 'Postres',
        'menu-drinks': 'Bebidas',
        'menu-others': 'Otros',
        'footer-copyright': '© 2024 Talita Cumi\'s. Todos los derechos reservados.'
    }
}; 