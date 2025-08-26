// Função que analisa sequência de dezenas e distância média
function analisarSequencias(resultadosGlobais) {
    function analisarJogo(dezenas) {
      const nums = dezenas.map(n => parseInt(n)).sort((a, b) => a - b);
  
      // Conta sequência de colados
      let sequencias = 0;
      let atualSeq = 1;
      for (let i = 1; i < nums.length; i++) {
        if (nums[i] === nums[i - 1] + 1) {
          atualSeq++;
        } else {
          if (atualSeq >= 2) sequencias++;
          atualSeq = 1;
        }
      }
      if (atualSeq >= 2) sequencias++; // conta a última sequência
  
      // Calcula média de saltos
      let saltos = 0;
      for (let i = 1; i < nums.length; i++) {
        saltos += nums[i] - nums[i - 1];
      }
      let mediaSalto = saltos / (nums.length - 1);
  
      return { sequencias, mediaSalto };
    }
  
    function calcularMedias(jogos) {
      let totalSeq = 0;
      let totalSalto = 0;
      jogos.forEach(j => {
        const res = analisarJogo(j.dezenas);
        totalSeq += res.sequencias;
        totalSalto += res.mediaSalto;
      });
      return {
        mediaSequencias: (totalSeq / jogos.length).toFixed(2),
        mediaSaltos: (totalSalto / jogos.length).toFixed(2),
      };
    }
  
    const ultimos100 = calcularMedias(resultadosGlobais.slice(0, 100));
    const ultimos50 = calcularMedias(resultadosGlobais.slice(0, 50));
    const ultimos20 = calcularMedias(resultadosGlobais.slice(0, 20));
    const ultimos10 = calcularMedias(resultadosGlobais.slice(0, 10));
  
    return {
      ultimos100,
      ultimos50,
      ultimos20,
      ultimos10
    };
  }
  
  // Exporta para uso global
  window.analisarSequencias = analisarSequencias;  