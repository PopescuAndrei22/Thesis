export let results = {};
export let indexDict = {};
export let myPieChart = null;
export let ldaChart = null;
export const socket = io();

export function setMyPieChart(chart) {
  myPieChart = chart;
}

export function setLdaChart(chart) {
  ldaChart = chart;
}