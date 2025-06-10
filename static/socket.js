import { results, indexDict, sharedState } from './state.js';
import { initializeCharts } from './charts/initCharts.js';
import { addDropdowns } from './dropdowns/emotionDropdown.js';
import { addLdaDropdowns } from './dropdowns/ldaDropdown.js';
import { updatePieChart } from './charts/pieChart.js';
import { showResults, defaultValuesComponents, setComparasionText } from './utils/domUtils.js';
import { socket } from './state.js';
import { addEmotionEventListenersSummaries } from './events/summaryEvents.js';

function updateHandler(structureID){
  initializeCharts(structureID);
  addDropdowns(structureID);
  addLdaDropdowns(structureID);
  addEmotionEventListenersSummaries(structureID);
  defaultValuesComponents(structureID);
  showResults(structureID);
  updatePieChart(structureID);
}

socket.on('update-results', (msg) => {
  results[1] = msg;
  indexDict[1] = {};

  updateHandler(1);
});

socket.on('update-comparasion', (msg) => {
  results[1] = msg.result1;
  indexDict[1] = {};

  results[2] = msg.result2;
  indexDict[2] = {};

  updateHandler(1);
  updateHandler(2);

  setComparasionText(msg.comparasion_text);

});

export const startAnalysis = () => socket.emit('start_analysis_backend');

export const startComparasion = () => socket.emit('start_comparasion');
