const primos = [2,3,5,7,11,13,17,19,23];
const totalNumeros = 25;
const numerosPorJogo = 15;
const ultimosResultados = [
  // Cada resultado é um array com 15 dezenas, exemplo:
  [2,5,7,11,13,17,19,23,1,3,6,8,10,12,14],
  [1,3,5,7,9,11,13,15,17,19,21,23,2,4,6],
  // ... até os 10 últimos
];

// Função para gerar aposta aleatória de 15 dezenas únicas
function gerarAposta() {
  const nums = new Set();
  while(nums.size < numerosPorJogo) {
    nums.add(Math.floor(Math.random() * totalNumeros) + 1);
  }
  return Array.from(nums);
}

// Função para calcular estatísticas da aposta
function analisarAposta(aposta) {
  const qtdPrimos = aposta.filter(n => primos.includes(n)).length;
  const qtdPares = aposta.filter(n => n % 2 === 0).length;
  const soma = aposta.reduce((a,b) => a + b, 0);
  return {
    qtdPrimos,
    percPares: (qtdPares / numerosPorJogo) * 100,
    soma,
  };
}

// Função para contar quantos números da aposta bateram com um resultado
function contarAcertos(aposta, resultado) {
  return aposta.filter(n => resultado.includes(n)).length;
}

// Análise para um conjunto de apostas e últimos resultados
function analisarJogos(apostas, resultados) {
  apostas.forEach((aposta, i) => {
    const stats = analisarAposta(aposta);
    let acertou13 = 0, acertou14 = 0, acertou15 = 0;
    resultados.forEach(resultado => {
      const acertos = contarAcertos(aposta, resultado);
      if (acertos >= 13) acertou13++;
      if (acertos >= 14) acertou14++;
      if (acertos >= 15) acertou15++;
    });
    console.log(`Aposta ${i+1}: ${aposta.sort((a,b)=>a-b).join(', ')}`);
    console.log(`  Primos: ${stats.qtdPrimos}, % Pares: ${stats.percPares.toFixed(2)}%, Soma: ${stats.soma}`);
    console.log(`  Acertos em últimos ${resultados.length}: 13+: ${acertou13}, 14+: ${acertou14}, 15: ${acertou15}\n`);
  });
}

// Gerar apostas e analisar
const apostasGeradas = [];
for(let i=0; i<10; i++) {
  apostasGeradas.push(gerarAposta());
}

analisarJogos(apostasGeradas, ultimosResultados);