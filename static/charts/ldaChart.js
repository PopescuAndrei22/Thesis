import { setLdaChart, getLdaChart, destroyLdaChart, sharedState, ldaCharts } from '../state.js';

export const initializeLdaChart = (id) => {
  const canvas = document.getElementById(`ldaChart-${id}`);
  if (!canvas) {
    console.error(`Canvas element ldaChart-${id} not found.`);
    return;
  }
  const ctx = canvas.getContext('2d');

  destroyLdaChart(id);

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

  setLdaChart(id, chart);
};

export const updateLdaChartData = (chartData, id) => {
  const { labels, values } = chartData;

  ldaCharts[id].data.labels = labels;
  ldaCharts[id].data.datasets[0].data = values;
  ldaCharts[id].update();
};
