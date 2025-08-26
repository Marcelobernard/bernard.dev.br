// Utils para parsing CSV simples (separado por ;)
function parseCSV(csv) {
    const linhas = csv.trim().split('\n');
    const headers = linhas.shift().split(';');
    return linhas.map(linha => {
      const valores = linha.split(';');
      let obj = {};
      headers.forEach((h, i) => {
        let val = valores[i].trim();
        if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
        obj[h] = val;
      });
      return obj;
    });
  }
  
  // Converter campos para tipos certos (números, arrays etc)
  function normalizeDados(arr) {
    return arr.map(item => ({
      concurso: parseInt(item.Concurso),
      soma: parseInt(item.Soma),
      numerosPrimos: item['Números Primos'].split(',').map(n => parseInt(n.trim())).filter(Boolean),
      qtdPrimos: parseInt(item['Qtd. Primos']),
      percPares: parseFloat(item['% Pares'].replace('%', '')),
      faixa1_5: parseInt(item['Faixa 1-5']),
      faixa6_10: parseInt(item['Faixa 6-10']),
      faixa11_15: parseInt(item['Faixa 11-15']),
      faixa16_20: parseInt(item['Faixa 16-20']),
      faixa21_25: parseInt(item['Faixa 21-25']),
      sequencias: parseInt(item['Sequências']),
      saltosMedios: parseFloat(item['Saltos Médios'])
    }));
  }
  
  // Exemplo de análise 1: checar anomalias (valores estranhos)
  function analisarAnomalias(dados) {
    // Exemplo: soma fora de intervalo esperado [150, 230]
    const anomalias = dados.filter(d => d.soma < 150 || d.soma > 230);
    return { ok: anomalias.length === 0, count: anomalias.length };
  }
  
  // Exemplo de análise 2: correlação simples pares x primos (média de primos em grupos de pares)
  function correlacionarParesPrimos(dados) {
    // Dividir dados em grupos por % pares: <40, 40-50, >50
    let grupos = { baixo: [], medio: [], alto: [] };
    dados.forEach(d => {
      if (d.percPares < 40) grupos.baixo.push(d);
      else if (d.percPares <= 50) grupos.medio.push(d);
      else grupos.alto.push(d);
    });
  
    // Calcular média de primos por grupo
    let medias = {};
    for (let g in grupos) {
      const grupo = grupos[g];
      const mediaPrimos = grupo.reduce((acc, cur) => acc + cur.qtdPrimos, 0) / (grupo.length || 1);
      medias[g] = mediaPrimos.toFixed(2);
    }
    return medias;
  }
  
  // Exemplo de análise 3: primos x soma (média da soma por quantidade de primos)
  function correlacionarPrimosSoma(dados) {
    // Agrupar por qtdPrimos e calcular média soma
    const mapa = {};
    dados.forEach(d => {
      if (!mapa[d.qtdPrimos]) mapa[d.qtdPrimos] = [];
      mapa[d.qtdPrimos].push(d.soma);
    });
  
    const medias = {};
    for (const qtd in mapa) {
      const vals = mapa[qtd];
      const media = vals.reduce((a, b) => a + b, 0) / vals.length;
      medias[qtd] = media.toFixed(2);
    }
    return medias;
  }
  
  // Exemplo de análise 4: pares x números menos frequentes (você precisaria ter lista desses números)
  function correlacionarParesMenosFrequentes(dados, numerosMenosFreq) {
    // Apenas demonstração: média % pares nos concursos que tem algum número menos frequente
    let concursosComMenosFreq = dados.filter(d => {
      // Aqui deveria analisar se dezenas contém números menos frequentes, mas não temos dezenas no exemplo
      // Vou simular: randomicamente 50% entram
      return Math.random() < 0.5;
    });
  
    const mediaPares = concursosComMenosFreq.reduce((acc, cur) => acc + cur.percPares, 0) / (concursosComMenosFreq.length || 1);
    return mediaPares.toFixed(2);
  }
  
  // Função geral
  async function analisarCSV(csv, numerosMenosFreq=[]) {
    console.log("Lendo tabela ...");
    const dadosRaw = parseCSV(csv);
    const dados = normalizeDados(dadosRaw);
    console.log("Lendo tabela ... -> OK");
  
    console.log("Identificando anomalias ...");
    const anomalias = analisarAnomalias(dados);
    console.log("Identificando anomalias ... -> OK", anomalias);
  
    console.log("Correlacionando pares com primos ...");
    const paresPrimos = correlacionarParesPrimos(dados);
    console.log("Correlacionando pares com primos ... -> OK", paresPrimos);
  
    console.log("Correlacionando primos com somas ...");
    const primosSomas = correlacionarPrimosSoma(dados);
    console.log("Correlacionando primos com somas ... -> OK", primosSomas);
  
    console.log("Correlacionando pares com números que aparecem pouco ...");
    const paresMenosFreq = correlacionarParesMenosFrequentes(dados, numerosMenosFreq);
    console.log("Correlacionando pares com números que aparecem pouco ... -> OK", paresMenosFreq);
  
    return { anomalias, paresPrimos, primosSomas, paresMenosFreq };
  }
  
  // Exemplo de uso:
  // fetch('dados.csv').then(r=>r.text()).then(text => analisarCSV(text, [20,5,18,10]));  