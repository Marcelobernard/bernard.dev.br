const ctxPrimos = document.getElementById('graficoPrimos').getContext('2d');
const graficoPrimos = new Chart(ctxPrimos, {
  type: 'bar',
  data: {
    labels: ['100', '50', '20', '10'],
    datasets: [{
      label: 'Média de Números Primos',
      data: [media100, media50, media20, media10], // valores que você calcula
      backgroundColor: 'rgba(75, 192, 192, 0.6)'
    }]
  },
  options: {
    scales: { y: { beginAtZero: true, max: 9 } } // max 9 primos
  }
});
