// Função que calcula frequência das dezenas num dado conjunto de jogos
function calcularFrequencia(jogos) {
    const freq = {};
    for (let i = 1; i <= 25; i++) freq[i] = 0;
    jogos.forEach(jogo => {
      jogo.dezenas.forEach(num => {
        freq[parseInt(num)]++;
      });
    });
    return freq;
  }
  
  // Função que retorna os N números menos frequentes em um conjunto
  function menosFrequentes(freq, n = 10) {
    return Object.entries(freq)
      .sort((a, b) => a[1] - b[1])
      .slice(0, n)
      .map(x => x[0]);
  }
  
  // Função principal de análise
  function analisarFrequencias(resultadosGlobais) {
    const ultimos100 = resultadosGlobais.slice(0, 100);
    const ultimos50 = resultadosGlobais.slice(0, 50);
    const ultimos20 = resultadosGlobais.slice(0, 20);
    const ultimos10 = resultadosGlobais.slice(0, 10);
  
    const freq100 = calcularFrequencia(ultimos100);
    const freq50 = calcularFrequencia(ultimos50);
    const freq20 = calcularFrequencia(ultimos20);
    const freq10 = calcularFrequencia(ultimos10);
  
    const menos100 = menosFrequentes(freq100);
    const menos50 = menosFrequentes(freq50);
    const menos20 = menosFrequentes(freq20);
    const menos10 = menosFrequentes(freq10);
  
    // Números menos comuns em pelo menos 2 dos 3 casos
    const menosComum = menos100.filter(n => menos50.includes(n) || menos20.includes(n));
  
    // Lógica para alertar anomalia nos últimos 10 jogos
    const ultimos10Nums = ultimos10.flatMap(j => j.dezenas);
    const contagemAnomalia = ultimos10Nums.filter(n => menosComum.includes(n));
  
    return {
        freq100,
        freq50,
        freq20,
        freq10,
        menos100,
        menos50,
        menos20,
        menos10,
        menosComum,
        contagemAnomalia,
        anomalia: contagemAnomalia.length < 5
      };
  }
  
  // Exporta para uso global
  window.analisarFrequencias = analisarFrequencias;  