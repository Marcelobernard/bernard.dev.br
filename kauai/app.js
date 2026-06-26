// KFutVolei — app.js

// ── Estado global ──────────────────────────────────────────────
const State = {
  usuarioLogado: false,
  usuario: { nome: "Lucas Ferreira", foto: null },
  favoritos: JSON.parse(localStorage.getItem("kfv_favoritos") || "[]"),
  recentes: JSON.parse(localStorage.getItem("kfv_recentes") || "[]"),
  filtros: { nome: "", categoria: "Todas", cidade: "", gratuitos: false, abertos: false, ordem: "data" },
  paginaAtual: 1,
  porPagina: 9,
  torneiosFiltrados: [],
  modalAberto: null
};

// ── Utilidades ─────────────────────────────────────────────────
function formatarData(dataStr) {
  const [ano, mes, dia] = dataStr.split("-");
  const meses = ["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"];
  return `${dia} ${meses[parseInt(mes) - 1]} ${ano}`;
}

function diasRestantes(dataStr) {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const evento = new Date(dataStr + "T00:00:00");
  const diff = Math.ceil((evento - hoje) / (1000 * 60 * 60 * 24));
  if (diff < 0) return null;
  if (diff === 0) return "Hoje!";
  if (diff === 1) return "Amanhã";
  return `${diff} dias`;
}

function corCategoria(categoria) {
  const mapa = { Profissional: "var(--ciano)", Intermediário: "var(--dourado)", Amador: "var(--prata)" };
  return mapa[categoria] || "var(--text-muted)";
}

function classCategoria(categoria) {
  const mapa = { Profissional: "cat-pro", Intermediário: "cat-int", Amador: "cat-ama" };
  return mapa[categoria] || "";
}

function salvarFavoritos() {
  localStorage.setItem("kfv_favoritos", JSON.stringify(State.favoritos));
}

function salvarRecentes() {
  localStorage.setItem("kfv_recentes", JSON.stringify(State.recentes));
}

function toggleFavorito(id) {
  const idx = State.favoritos.indexOf(id);
  if (idx === -1) State.favoritos.push(id);
  else State.favoritos.splice(idx, 1);
  salvarFavoritos();
  atualizarBotoesFavoritos(id);
}

function adicionarRecente(id) {
  State.recentes = State.recentes.filter(r => r !== id);
  State.recentes.unshift(id);
  if (State.recentes.length > 5) State.recentes = State.recentes.slice(0, 5);
  salvarRecentes();
}

function atualizarBotoesFavoritos(id) {
  document.querySelectorAll(`[data-fav="${id}"]`).forEach(btn => {
    const ativo = State.favoritos.includes(id);
    btn.classList.toggle("ativo", ativo);
    btn.title = ativo ? "Remover dos favoritos" : "Adicionar aos favoritos";
  });
}

// ── Header ─────────────────────────────────────────────────────
function renderHeader() {
  const areaUsuario = document.getElementById("header-usuario");
  if (!areaUsuario) return;

  if (State.usuarioLogado) {
    const iniciais = State.usuario.nome.split(" ").map(p => p[0]).join("").slice(0, 2).toUpperCase();
    areaUsuario.innerHTML = `
      <div class="header-perfil" id="btn-perfil">
        <div class="avatar-circle">${iniciais}</div>
        <span class="header-nome">${State.usuario.nome.split(" ")[0]}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
      </div>
      <div class="header-menu" id="header-menu">
        <a href="#" class="menu-item">Meu perfil</a>
        <a href="#" class="menu-item">Favoritos <span class="badge">${State.favoritos.length}</span></a>
        <a href="#" class="menu-item">Inscrições</a>
        <div class="menu-divider"></div>
        <a href="#" class="menu-item menu-sair" id="btn-sair">Sair</a>
      </div>`;

    document.getElementById("btn-perfil")?.addEventListener("click", (e) => {
      e.stopPropagation();
      document.getElementById("header-menu")?.classList.toggle("visivel");
    });

    document.getElementById("btn-sair")?.addEventListener("click", (e) => {
      e.preventDefault();
      State.usuarioLogado = false;
      renderHeader();
    });
  } else {
    areaUsuario.innerHTML = `
      <a href="#" class="btn-header-link" id="btn-login">Entrar</a>
      <span class="separator">|</span>
      <a href="#" class="btn-header-link btn-register" id="btn-registrar">Registrar-se</a>`;

    document.getElementById("btn-login")?.addEventListener("click", (e) => {
      e.preventDefault();
      State.usuarioLogado = true;
      renderHeader();
    });
  }
}

// ── Stats ───────────────────────────────────────────────────────
async function renderStats() {
  const stats = await Api.getStats();
  const container = document.getElementById("stats-container");
  if (!container) return;

  const itens = [
    { valor: stats.atletas.toLocaleString("pt-BR"), label: "Atletas cadastrados" },
    { valor: stats.torneios, label: "Torneios realizados" },
    { valor: stats.cidades, label: "Cidades" },
    { valor: stats.inscricoesAbertas, label: "Inscrições abertas" }
  ];

  container.innerHTML = itens.map(i => `
    <div class="stat-item">
      <span class="stat-valor">${i.valor}</span>
      <span class="stat-label">${i.label}</span>
    </div>`).join("");
}

// ── Torneios em destaque ────────────────────────────────────────
async function renderDestaques() {
  const container = document.getElementById("destaques-container");
  if (!container) return;

  container.innerHTML = `<div class="loading-state">Carregando...</div>`;
  const torneios = await Api.getTorneiosDestaque();
  container.innerHTML = torneios.map(t => cardDestaque(t)).join("");
  bindCardEvents(container);
}

function cardDestaque(t) {
  const dias = diasRestantes(t.data);
  const favAtivo = State.favoritos.includes(t.id) ? "ativo" : "";
  return `
  <div class="card-destaque ${classCategoria(t.categoria)}" data-id="${t.id}">
    <div class="card-img-wrap">
      <img src="${t.imagem}" alt="${t.nome}" loading="lazy">
      <span class="badge-categoria ${classCategoria(t.categoria)}">${t.categoria}</span>
      ${dias ? `<span class="badge-dias">${dias}</span>` : ""}
      <button class="btn-fav ${favAtivo}" data-fav="${t.id}" title="Favoritar">♥</button>
    </div>
    <div class="card-body">
      <h3 class="card-titulo">${t.nome}</h3>
      <div class="card-meta">
        <span class="meta-item">📍 ${t.bairro}</span>
        <span class="meta-item">📅 ${formatarData(t.data)}</span>
        <span class="meta-item">🕐 ${t.horario}</span>
      </div>
      <div class="card-premiacao">
        <span class="label-premiacao">Premiação</span>
        <span class="valor-premiacao">${t.premiacao}</span>
      </div>
      <button class="btn-ver-detalhes" data-id="${t.id}">Ver detalhes</button>
    </div>
  </div>`;
}

// ── Categorias ──────────────────────────────────────────────────
async function renderCategorias() {
  for (const cat of ["Profissional", "Intermediário", "Amador"]) {
    const container = document.getElementById(`cat-${cat.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}`);
    if (!container) continue;
    const torneios = await Api.getTorneiosPorCategoria(cat);
    container.innerHTML = torneios.slice(0, 6).map(t => cardTorneio(t)).join("");
    bindCardEvents(container);
  }
}

function cardTorneio(t) {
  const dias = diasRestantes(t.data);
  const favAtivo = State.favoritos.includes(t.id) ? "ativo" : "";
  const cor = corCategoria(t.categoria);
  return `
  <div class="card-torneio" style="--cor-cat: ${cor}" data-id="${t.id}">
    <div class="card-torneio-img">
      <img src="${t.imagem}" alt="${t.nome}" loading="lazy">
      ${dias ? `<span class="badge-dias-sm">${dias}</span>` : ""}
      <button class="btn-fav ${favAtivo}" data-fav="${t.id}" title="Favoritar">♥</button>
    </div>
    <div class="card-torneio-body">
      <div class="card-torneio-header">
        <span class="tag-status tag-${t.status === "Inscrições abertas" ? "aberto" : t.status === "Em breve" ? "breve" : "encerrado"}">${t.status}</span>
        <span class="tag-inscricao ${t.inscricao === "Gratuito" ? "tag-gratis" : ""}">${t.inscricao}</span>
      </div>
      <h4 class="card-torneio-titulo">${t.nome}</h4>
      <div class="card-torneio-info">
        <div class="info-row"><span class="info-icon">📅</span><span>${formatarData(t.data)} às ${t.horario}</span></div>
        <div class="info-row"><span class="info-icon">📍</span><span>${t.local}</span></div>
        <div class="info-row"><span class="info-icon">👥</span><span>${t.vagas} vagas · ${t.organizador}</span></div>
      </div>
      <div class="card-torneio-footer">
        <span class="premiacao-label">${t.premiacao}</span>
        <button class="btn-sm-detalhes" data-id="${t.id}">Detalhes</button>
      </div>
    </div>
  </div>`;
}

// ── Ranking ─────────────────────────────────────────────────────
async function renderRanking() {
  const container = document.getElementById("ranking-container");
  if (!container) return;
  const ranking = await Api.getRanking();
  container.innerHTML = ranking.map(r => `
    <div class="ranking-item">
      <span class="rank-pos ${r.posicao === 1 ? "rank-ouro" : r.posicao === 2 ? "rank-prata" : r.posicao === 3 ? "rank-bronze" : ""}">${r.posicao}°</span>
      <div class="rank-info">
        <span class="rank-nome">${r.nome} / ${r.dupla}</span>
        <span class="rank-cat ${classCategoria(r.categoria)}">${r.categoria}</span>
      </div>
      <span class="rank-pts">${r.pontos.toLocaleString("pt-BR")} pts</span>
    </div>`).join("");
}

// ── Torneios (listagem principal com filtros) ───────────────────
async function aplicarFiltros() {
  State.paginaAtual = 1;
  State.torneiosFiltrados = await Api.buscarTorneios(State.filtros);
  renderListagem();
}

function renderListagem() {
  const container = document.getElementById("torneios-lista");
  const contadorEl = document.getElementById("contador-resultados");
  const btnMais = document.getElementById("btn-carregar-mais");
  if (!container) return;

  const total = State.torneiosFiltrados.length;
  const ate = State.paginaAtual * State.porPagina;
  const exibidos = State.torneiosFiltrados.slice(0, ate);

  if (contadorEl) contadorEl.textContent = `${total} torneio${total !== 1 ? "s" : ""} encontrado${total !== 1 ? "s" : ""}`;

  if (total === 0) {
    container.innerHTML = `<div class="empty-state"><p>Nenhum torneio encontrado.</p><small>Tente ajustar os filtros.</small></div>`;
    if (btnMais) btnMais.style.display = "none";
    return;
  }

  container.innerHTML = exibidos.map(t => cardTorneio(t)).join("");
  bindCardEvents(container);

  if (btnMais) btnMais.style.display = ate < total ? "flex" : "none";
}

function carregarMais() {
  State.paginaAtual++;
  renderListagem();
}

// ── Modal detalhes ──────────────────────────────────────────────
async function abrirModal(id) {
  const torneio = await Api.getTorneio(id);
  if (!torneio) return;

  adicionarRecente(id);
  State.modalAberto = id;

  const modal = document.getElementById("modal-detalhe");
  const corpo = document.getElementById("modal-corpo");
  if (!modal || !corpo) return;

  const dias = diasRestantes(torneio.data);
  const favAtivo = State.favoritos.includes(id) ? "ativo" : "";

  corpo.innerHTML = `
    <div class="modal-img-wrap">
      <img src="${torneio.imagem}" alt="${torneio.nome}">
      <span class="badge-categoria ${classCategoria(torneio.categoria)}">${torneio.categoria}</span>
    </div>
    <div class="modal-info">
      <div class="modal-header-info">
        <h2>${torneio.nome}</h2>
        <button class="btn-fav btn-fav-modal ${favAtivo}" data-fav="${id}" title="Favoritar">♥</button>
      </div>
      ${dias ? `<div class="modal-dias">${dias} para o evento</div>` : ""}
      <div class="modal-grid">
        <div class="modal-campo"><span class="campo-label">📅 Data</span><span class="campo-val">${formatarData(torneio.data)}</span></div>
        <div class="modal-campo"><span class="campo-label">🕐 Horário</span><span class="campo-val">${torneio.horario}</span></div>
        <div class="modal-campo"><span class="campo-label">📍 Local</span><span class="campo-val">${torneio.local}</span></div>
        <div class="modal-campo"><span class="campo-label">🏙️ Bairro</span><span class="campo-val">${torneio.bairro}, ${torneio.cidade}</span></div>
        <div class="modal-campo"><span class="campo-label">💰 Inscrição</span><span class="campo-val ${torneio.inscricao === "Gratuito" ? "text-green" : ""}">${torneio.inscricao}</span></div>
        <div class="modal-campo"><span class="campo-label">🏆 Premiação</span><span class="campo-val">${torneio.premiacao}</span></div>
        <div class="modal-campo"><span class="campo-label">👥 Vagas</span><span class="campo-val">${torneio.vagas}</span></div>
        <div class="modal-campo"><span class="campo-label">📌 Status</span><span class="campo-val tag-status tag-${torneio.status === "Inscrições abertas" ? "aberto" : torneio.status === "Em breve" ? "breve" : "encerrado"}">${torneio.status}</span></div>
        <div class="modal-campo modal-campo-full"><span class="campo-label">🎽 Organizador</span><span class="campo-val">${torneio.organizador}</span></div>
      </div>
      <button class="btn-inscrever ${torneio.status !== "Inscrições abertas" ? "btn-disabled" : ""}">
        ${torneio.status === "Inscrições abertas" ? "Inscrever-se agora" : torneio.status}
      </button>
    </div>`;

  const favBtn = corpo.querySelector(`[data-fav="${id}"]`);
  if (favBtn) favBtn.addEventListener("click", () => toggleFavorito(id));

  modal.classList.add("aberto");
  document.body.style.overflow = "hidden";
}

function fecharModal() {
  const modal = document.getElementById("modal-detalhe");
  if (modal) modal.classList.remove("aberto");
  document.body.style.overflow = "";
  State.modalAberto = null;
}

// ── Eventos globais dos cards ───────────────────────────────────
function bindCardEvents(container) {
  container.querySelectorAll("[data-fav]").forEach(btn => {
    const id = parseInt(btn.dataset.fav);
    btn.classList.toggle("ativo", State.favoritos.includes(id));
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleFavorito(id);
    });
  });

  container.querySelectorAll("[data-id]").forEach(card => {
    const detalheBtn = card.querySelector(".btn-ver-detalhes, .btn-sm-detalhes");
    if (detalheBtn) {
      detalheBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        abrirModal(parseInt(card.dataset.id));
      });
    }
    card.addEventListener("click", () => abrirModal(parseInt(card.dataset.id)));
  });
}

// ── Filtros UI ──────────────────────────────────────────────────
function initFiltros() {
  const form = document.getElementById("form-filtros");
  if (!form) return;

  form.querySelector("#inp-nome")?.addEventListener("input", (e) => {
    State.filtros.nome = e.target.value;
    aplicarFiltros();
  });

  form.querySelector("#inp-cidade")?.addEventListener("input", (e) => {
    State.filtros.cidade = e.target.value;
    aplicarFiltros();
  });

  form.querySelectorAll(".btn-cat-filtro").forEach(btn => {
    btn.addEventListener("click", () => {
      form.querySelectorAll(".btn-cat-filtro").forEach(b => b.classList.remove("ativo"));
      btn.classList.add("ativo");
      State.filtros.categoria = btn.dataset.cat;
      aplicarFiltros();
    });
  });

  form.querySelector("#chk-gratuitos")?.addEventListener("change", (e) => {
    State.filtros.gratuitos = e.target.checked;
    aplicarFiltros();
  });

  form.querySelector("#chk-abertos")?.addEventListener("change", (e) => {
    State.filtros.abertos = e.target.checked;
    aplicarFiltros();
  });

  form.querySelector("#sel-ordem")?.addEventListener("change", (e) => {
    State.filtros.ordem = e.target.value;
    aplicarFiltros();
  });
}

// ── Inicialização ───────────────────────────────────────────────
async function init() {
  renderHeader();
  renderStats();
  renderDestaques();
  renderCategorias();
  renderRanking();
  initFiltros();
  await aplicarFiltros();

  // Modal fechar
  document.getElementById("btn-fechar-modal")?.addEventListener("click", fecharModal);
  document.getElementById("modal-detalhe")?.addEventListener("click", (e) => {
    if (e.target === e.currentTarget) fecharModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && State.modalAberto) fecharModal();
  });

  // Fechar menu ao clicar fora
  document.addEventListener("click", () => {
    document.getElementById("header-menu")?.classList.remove("visivel");
  });

  // Carregar mais
  document.getElementById("btn-carregar-mais")?.addEventListener("click", carregarMais);

  // Scroll suave nav
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener("click", (e) => {
      const alvo = document.querySelector(a.getAttribute("href"));
      if (alvo) { e.preventDefault(); alvo.scrollIntoView({ behavior: "smooth" }); }
    });
  });
}

document.addEventListener("DOMContentLoaded", init);
