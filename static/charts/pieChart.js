import { myPieChart, setMyPieChart } from '../state.js';
import { getRandomColor } from '../utils/colors.js';

export const initializePieChart = () => {
  const ctx = document.getElementById('myPieChart').getContext('2d');

  if (myPieChart) myPieChart.destroy();

  const chart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: [],
      datasets: [{ data: [], backgroundColor: [], hoverOffset: 4 }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        title: { display: true, text: 'Rezultatele analizei' }
      }
    }
  });
  setMyPieChart(chart);
};

export const updatePieChart = (results) => {
  Object.entries(results).forEach(([emotion, data]) => {
    myPieChart.data.labels.push(emotion);
    myPieChart.data.datasets[0].backgroundColor.push(getRandomColor());
    myPieChart.data.datasets[0].data.push(data.review_count);
  });

  myPieChart.update();
};
