import { ldaChart, setLdaChart } from '../state.js';

export const initializeLdaChart = () => {
  const ctx = document.getElementById('ldaChart').getContext('2d');

  if (ldaChart) ldaChart.destroy();

  const chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: [],
      datasets: [{
        label: 'Keyword Relevance',
        data: [],
        backgroundColor: 'rgba(54, 162, 235, 0.7)',
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      plugins: {
        legend: { display: false },
        title: { display: true, text: 'LDA Topic Keywords' }
      },
      scales: {
        x: { beginAtZero: true }
      }
    }
  });
  setLdaChart(chart);
};

export const updateLdaChartData = (chartData) => {
  const { labels, values } = chartData;

  ldaChart.data.labels = labels;
  ldaChart.data.datasets[0].data = values;
  ldaChart.update();
};
