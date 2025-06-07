import { initializePieChart } from './pieChart.js';
import { initializeLdaChart } from './ldaChart.js';

export const initializeCharts = () => {
  initializePieChart();
  initializeLdaChart();
};