import { results } from '../state.js';
import { updateSummaries } from '../events/summaryEvents.js';
import { updateLdaChart } from '../dropdowns/ldaDropdown.js';

export const showResults = () => {
  document.getElementById("loader-container").classList.add("hidden");
  document.getElementById("topic-wrapper").classList.remove("hidden");
  document.getElementById("lda-chart").classList.remove("hidden");
  document.getElementById("nav-bar").classList.remove("hidden");
};

export const defaultValuesComponents = () => {
  const emotion = Object.keys(results)[0];
  updateSummaries(emotion);
  updateLdaChart(emotion);
};
