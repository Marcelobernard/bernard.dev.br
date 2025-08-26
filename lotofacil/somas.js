function analisarSomaDezenas(resultadosGlobais) {
    function calcularSomasComFiltro(jogos, removerExtremos = 0) {
      const somas = jogos.map(jogo =>
        jogo.dezenas.reduce((acc, num) => acc + parseInt(num), 0)
      );
      const ordenado = [...somas].sort((a, b) => a - b);
      return ordenado.slice(removerExtremos, ordenado.length - removerExtremos);
    }
  
    function contarFaixas(somas) {
      const faixas = {};
      // Define faixas de 10 em 10, de 150 a 220 (ajuste se quiser)
      for(let i = 150; i <= 220; i += 10) {
        const faixa = `${i}-${i+9}`;
        faixas[faixa] = 0;
      }
  
      somas.forEach(soma => {
        for(let i = 150; i <= 220; i += 10) {
          if (soma >= i && soma <= i + 9) {
            const faixa = `${i}-${i+9}`;
            faixas[faixa]++;
            break;
          }
        }
      });
  
      return faixas;
    }
  
    const ultimos100 = calcularSomasComFiltro(resultadosGlobais.slice(0, 100), 0);
    const ultimos50 = calcularSomasComFiltro(resultadosGlobais.slice(0, 50), 2);
    const ultimos20 = calcularSomasComFiltro(resultadosGlobais.slice(0, 20), 2);
    const ultimos10 = calcularSomasComFiltro(resultadosGlobais.slice(0, 10), 1);
  
    function calcularMedia(somas) {
      const total = somas.reduce((acc, val) => acc + val, 0);
      return (total / somas.length).toFixed(1);
    }
  
    return {
      media100: calcularMedia(ultimos100),
      faixas100: contarFaixas(ultimos100),
  
      media50: calcularMedia(ultimos50),
      faixas50: contarFaixas(ultimos50),
  
      media20: calcularMedia(ultimos20),
      faixas20: contarFaixas(ultimos20),
  
      media10: calcularMedia(ultimos10),
      faixas10: contarFaixas(ultimos10)
    };
  }
  
  // Exporta para uso global
  window.analisarSomaDezenas = analisarSomaDezenas;  