function testarAposta(minhaAposta, resultadosGlobais, quantidadeConcursos) {
    const ultimos = resultadosGlobais.slice(0, quantidadeConcursos);
  
    let acertou13 = 0;
    let acertou14 = 0;
    let acertou15 = 0;
  
    ultimos.forEach(jogo => {
      // Quantos números da minha aposta aparecem nesse jogo?
      const acertos = minhaAposta.filter(num => jogo.dezenas.includes(num)).length;
  
      if (acertos >= 13) acertou13++;
      if (acertos >= 14) acertou14++;
      if (acertos === 15) acertou15++;
    });
  
    return {
      acertou13,
      acertou14,
      acertou15
    };
  }
  