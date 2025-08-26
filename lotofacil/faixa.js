const faixas = [
    { nome: '1-5', inicio: 1, fim: 5 },
    { nome: '6-10', inicio: 6, fim: 10 },
    { nome: '11-15', inicio: 11, fim: 15 },
    { nome: '16-20', inicio: 16, fim: 20 },
    { nome: '21-25', inicio: 21, fim: 25 },
  ];
  
  function contarNumerosNaFaixa(dezenas, faixa) {
    return dezenas.reduce((count, num) => {
      const n = parseInt(num);
      return (n >= faixa.inicio && n <= faixa.fim) ? count + 1 : count;
    }, 0);
  }
  
  function calcularMediaFaixas(jogos) {
    const medias = {};
    const totalJogos = jogos.length;
  
    faixas.forEach(faixa => {
      let soma = 0;
      let vezesTodos5 = 0;
      let vezesNenhum = 0;
  
      jogos.forEach(jogo => {
        const count = contarNumerosNaFaixa(jogo.dezenas, faixa);
        soma += count;
        if (count === 5) vezesTodos5++;
        if (count === 0) vezesNenhum++;
      });
  
      medias[faixa.nome] = {
        media: (soma / totalJogos).toFixed(2),
        todos5: vezesTodos5,
        nenhum: vezesNenhum
      };
    });
  
    return medias;
  }
  
  function analisarFaixas(resultadosGlobais) {
    const ultimos100 = resultadosGlobais.slice(0, 100);
    const ultimos50 = resultadosGlobais.slice(0, 50);
    const ultimos20 = resultadosGlobais.slice(0, 20);
    const ultimos10 = resultadosGlobais.slice(0, 10);
  
    return {
      ultimos100: calcularMediaFaixas(ultimos100),
      ultimos50: calcularMediaFaixas(ultimos50),
      ultimos20: calcularMediaFaixas(ultimos20),
      ultimos10: calcularMediaFaixas(ultimos10),
    };
  }
  
  window.analisarFaixas = analisarFaixas;
  