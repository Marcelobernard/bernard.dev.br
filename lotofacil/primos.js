// Lista dos números primos entre 1 e 25
const primos = [2, 3, 5, 7, 11, 13, 17, 19, 23];

// Função que calcula a média de primos sorteados em um conjunto de jogos
function analisarPrimos(resultadosGlobais) {
  function calcularMediaPrimos(jogos) {
    let totalPrimos = 0;

    jogos.forEach(jogo => {
      const primosNoJogo = jogo.dezenas.filter(num => primos.includes(parseInt(num)));
      totalPrimos += primosNoJogo.length;
    });

    return (totalPrimos / jogos.length).toFixed(2);
  }

  const ultimos100 = resultadosGlobais.slice(0, 100);
  const ultimos50 = resultadosGlobais.slice(0, 50);
  const ultimos20 = resultadosGlobais.slice(0, 20);
  const ultimos10 = resultadosGlobais.slice(0, 10);

  return {
    media100: calcularMediaPrimos(ultimos100),
    media50: calcularMediaPrimos(ultimos50),
    media20: calcularMediaPrimos(ultimos20),
    media10: calcularMediaPrimos(ultimos10),
    totalPrimos: primos.length
  };
}

// Exporta para uso global
window.analisarPrimos = analisarPrimos;
