// Função que calcula média percentual de pares e ímpares num conjunto de jogos
function analisarParImpar(resultadosGlobais) {
    // Helper para calcular % par/ímpar em um conjunto
    function calcularPercentual(jogos) {
      let totalNumeros = 0;
      let pares = 0;
      let impares = 0;
  
      jogos.forEach(jogo => {
        jogo.dezenas.forEach(num => {
          totalNumeros++;
          if (parseInt(num) % 2 === 0) pares++;
          else impares++;
        });
      });
  
      return {
        parPercent: ((pares / totalNumeros) * 100).toFixed(2),
        imparPercent: ((impares / totalNumeros) * 100).toFixed(2),
      };
    }
  
    const ultimos100 = resultadosGlobais.slice(0, 100);
    const ultimos50 = resultadosGlobais.slice(0, 50);
    const ultimos20 = resultadosGlobais.slice(0, 20);
    const ultimos10 = resultadosGlobais.slice(0, 10);
  
    const perc100 = calcularPercentual(ultimos100);
    const perc50 = calcularPercentual(ultimos50);
    const perc20 = calcularPercentual(ultimos20);
    const perc10 = calcularPercentual(ultimos10);
  
    return {
      perc100,
      perc50,
      perc20,
      perc10
    };
  }
  
  // Exporta para uso global
  window.analisarParImpar = analisarParImpar;  