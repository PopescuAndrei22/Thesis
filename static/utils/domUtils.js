import { results, sharedState } from '../state.js';
import { updateSummaries } from '../events/summaryEvents.js';
import { updateLdaChart } from '../dropdowns/ldaDropdown.js';

export const showResults = (id) => {
  document.getElementById("loader-container").classList.add("hidden");

  document.querySelectorAll(".default-hidden").forEach(function(element) {
      element.classList.remove("hidden");
  });
};

export const defaultValuesComponents = (id) => {
  const emotion = Object.keys(results[id])[0];
  updateSummaries(id, emotion);
  updateLdaChart(id, emotion);
};

export const setComparasionText = (generatedText) => {
  document.getElementById('llm-comparison-section').innerHTML = generatedText;
};