import { results, setMyPieChart, destroyMyPieChart, pieCharts } from '../state.js';
import { getRandomColor } from '../utils/colors.js';

export const initializePieChart = (id) => {
  const canvas = document.getElementById(`myPieChart-${id}`);
  if (!canvas) {
    console.error(`Canvas element myPieChart-${id} not found.`);
    return;
  }
  const ctx = canvas.getContext('2d');

  destroyMyPieChart(id);

  const chart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: [],
      datasets: [{
        data: [],
        backgroundColor: [],
        hoverOffset: 4
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        title: { display: true, text: 'Rezultatele analizei' }
      }
    }
  });

  setMyPieChart(id, chart);
};

export const updatePieChart = (id) => {
  Object.entries(results[id]).forEach(([emotion, data]) => {
    pieCharts[id].data.labels.push(emotion);
    pieCharts[id].data.datasets[0].backgroundColor.push(getRandomColor());
    pieCharts[id].data.datasets[0].data.push(data.review_count);
  });

  pieCharts[id].update();
};
