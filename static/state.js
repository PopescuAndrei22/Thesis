export let results = {};
export let indexDict = {};
export let pieCharts = {}; 
export let ldaCharts = {};
export const socket = io();
export const sharedState = {
  structureCount: 0
};

export function setLdaChart(id, chart) {
  ldaCharts[id] = chart;
}

export function getLdaChart(id) {
  return ldaCharts[id];
}

export function destroyLdaChart(id) {
  if (ldaCharts[id]) {
    ldaCharts[id].destroy();
    delete ldaCharts[id];
  }
}

export function setMyPieChart(id, chart) {
  pieCharts[id] = chart;
}

export function getMyPieChart(id) {
  return pieCharts[id];
}

export function destroyMyPieChart(id) {
  if (pieCharts[id]) {
    pieCharts[id].destroy();
    delete pieCharts[id];
  }
}