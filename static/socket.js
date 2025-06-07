import { results, indexDict } from './state.js';
import { initializeCharts } from './charts/initCharts.js';
import { addDropdowns } from './dropdowns/emotionDropdown.js';
import { addLdaDropdowns } from './dropdowns/ldaDropdown.js';
import { updatePieChart } from './charts/pieChart.js';
import { showResults, defaultValuesComponents } from './utils/domUtils.js';
import { socket } from './state.js';

socket.on('update-results', (msg) => {
  Object.assign(results, msg);

  initializeCharts();
  addDropdowns(results);
  addLdaDropdowns(results);
  defaultValuesComponents();
  showResults();
  updatePieChart(results);
});

export const startAnalysis = () => socket.emit('start_analysis_backend');
