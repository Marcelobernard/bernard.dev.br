/**
 * Sistema de Traduções da Página Inicial
 * ------------------------------------
 * Este arquivo contém todas as traduções utilizadas na página inicial
 * do site do restaurante Talita Cumi's.
 * 
 * Estrutura:
 * - Cada idioma é uma chave principal ('pt-BR' ou 'es')
 * - Cada texto tem uma chave única que o identifica
 * - As chaves são organizadas por seção da página
 * 
 * Seções:
 * - Navegação (nav-*)
 * - Quem Somos (about-*)
 * - Localização (location-*)
 * - Horários (hours-*)
 * - Redes Sociais (social-*, instagram-*, whatsapp-*)
 * - Rodapé (footer-*)
 * 
 * Uso:
 * Para adicionar uma nova tradução:
 * 1. Adicione a chave em ambos os idiomas
 * 2. Use a chave no HTML com o atributo data-i18n
 * 3. A tradução será aplicada automaticamente ao mudar o idioma
 */

const translations = {
    'pt-BR': {
        'nav-home': 'Página Principal',
        'nav-menu': 'Cardápio',
        'about-title': 'Quem Somos',
        'about-text': 'Somos um estabelecimento restaurante e cafeteria, com uma culinária brasileira, venha saborear a verdadeira essência do Brasil!',
        'location-title': 'Localização',
        'location-address': 'Nosso Endereço',
        'location-text': 'C9XJ+GR7, Av. Ñeembucu, Pdte. Franco 100214, Paraguay',
        'location-reference': 'Próximo a Universidad Privada del Este',
        'hours-title': 'Horários',
        'hours-notice': 'De segunda-feira a sábado',
        'hours-morning': 'Cafeteria - Manhã',
        'hours-lunch': 'Almoço',
        'hours-afternoon': 'Cafeteria - Tarde',
        'social-title': 'Redes Sociais',
        'instagram-title': 'Instagram',
        'instagram-text': 'Siga-nos no Instagram para ver nossas novidades e promoções',
        'whatsapp-title': 'WhatsApp',
        'whatsapp-text': 'Entre em contato conosco pelo WhatsApp',
        'footer-copyright': '© 2024 Talita Cumi\'s. Todos os direitos reservados.'
    },
    'es': {
        'nav-home': 'Página Principal',
        'nav-menu': 'Menú',
        'about-title': 'Quiénes Somos',
        'about-text': 'Somos un restaurante y cafetería con culinária brasileña, ¡ven a saborear la verdadera esencia de Brasil!',
        'location-title': 'Ubicación',
        'location-address': 'Nuestra Dirección',
        'location-text': 'C9XJ+GR7, Av. Ñeembucu, Pdte. Franco 100214, Paraguay',
        'location-reference': 'Cerca de la Universidad Privada del Este',
        'hours-title': 'Horarios',
        'hours-notice': 'De lunes a sábado',
        'hours-morning': 'Cafetería - Mañana',
        'hours-lunch': 'Almuerzo',
        'hours-afternoon': 'Cafetería - Tarde',
        'social-title': 'Redes Sociales',
        'instagram-title': 'Instagram',
        'instagram-text': 'Síguenos en Instagram para ver nuestras novedades y promociones',
        'whatsapp-title': 'WhatsApp',
        'whatsapp-text': 'Contáctanos por WhatsApp',
        'footer-copyright': '© 2024 Talita Cumi\'s. Todos los derechos reservados.'
    }
}; 