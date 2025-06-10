import { updateSummaries } from '../events/summaryEvents.js';
import { sharedState, results } from '../state.js';

export const addDropdowns = (id) => {
  document.querySelectorAll(`.scrollable-dropdown-${id}`).forEach(dropdown => {
    dropdown.innerHTML = '';

    Object.keys(results[id]).forEach(emotion => {
      const li = document.createElement('li');
      li.innerHTML = `
        <a class="dropdown-item d-flex align-items-center gap-2 py-2" href="#">
          <span class="d-inline-block bg-info rounded-circle p-1"></span>${emotion}
        </a>`;
      dropdown.appendChild(li);
    });
  });
};
