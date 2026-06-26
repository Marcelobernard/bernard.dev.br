// KFutVolei — camada de API simulada

const Api = (() => {
  const delay = (ms = 200) => new Promise(res => setTimeout(res, ms));

  async function getTorneios() {
    await delay();
    return [...TORNEIOS];
  }

  async function getTorneiosDestaque() {
    await delay();
    return TORNEIOS.filter(t => t.destaque);
  }

  async function getTorneiosPorCategoria(categoria) {
    await delay();
    return TORNEIOS.filter(t => t.categoria === categoria);
  }

  async function getTorneio(id) {
    await delay();
    return TORNEIOS.find(t => t.id === id) || null;
  }

  async function getStats() {
    await delay();
    return { ...STATS };
  }

  async function getRanking() {
    await delay();
    return [...RANKING];
  }

  async function buscarTorneios({ nome = "", categoria = "", cidade = "", somenteGratuitos = false, somenteAbertos = false, ordenarPor = "data" } = {}) {
    await delay();
    let resultado = [...TORNEIOS];

    if (nome) {
      const q = nome.toLowerCase();
      resultado = resultado.filter(t => t.nome.toLowerCase().includes(q) || t.bairro.toLowerCase().includes(q));
    }
    if (categoria && categoria !== "Todas") {
      resultado = resultado.filter(t => t.categoria === categoria);
    }
    if (cidade) {
      const q = cidade.toLowerCase();
      resultado = resultado.filter(t => t.cidade.toLowerCase().includes(q) || t.bairro.toLowerCase().includes(q));
    }
    if (somenteGratuitos) {
      resultado = resultado.filter(t => t.inscricao === "Gratuito");
    }
    if (somenteAbertos) {
      resultado = resultado.filter(t => t.status === "Inscrições abertas");
    }

    if (ordenarPor === "data") {
      resultado.sort((a, b) => new Date(a.data) - new Date(b.data));
    } else if (ordenarPor === "premiacao") {
      resultado.sort((a, b) => {
        const val = str => parseFloat(str.replace(/[^\d]/g, "")) || 0;
        return val(b.premiacao) - val(a.premiacao);
      });
    } else if (ordenarPor === "vagas") {
      resultado.sort((a, b) => b.vagas - a.vagas);
    }

    return resultado;
  }

  return { getTorneios, getTorneiosDestaque, getTorneiosPorCategoria, getTorneio, getStats, getRanking, buscarTorneios };
})();
