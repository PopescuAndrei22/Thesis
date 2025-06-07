import { updateSummaries } from '../events/summaryEvents.js';

export const addDropdowns = (results) => {
  document.querySelectorAll('.scrollable-dropdown').forEach(dropdown => {
    dropdown.innerHTML = '';

    Object.keys(results).forEach(emotion => {
      const li = document.createElement('li');
      li.innerHTML = `
        <a class="dropdown-item d-flex align-items-center gap-2 py-2" href="#">
          <span class="d-inline-block bg-info rounded-circle p-1"></span>${emotion}
        </a>`;
      dropdown.appendChild(li);
    });
  });

  addEmotionEventListeners();
};

const addEmotionEventListeners = () => {
  document.querySelectorAll('.topic-description .scrollable-dropdown a').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      updateSummaries(item.innerText);
    });
  });
};
