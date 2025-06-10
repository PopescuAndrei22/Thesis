import { results, sharedState } from '../state.js';

export const addEmotionEventListenersSummaries = (id) => {
  document.querySelectorAll(`#topic-summaries-${id} .scrollable-dropdown-${id} a`).forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      updateSummaries(id, item.innerText);
    });
  });
};

export const updateSummaries = (id, emotion) => {
  const listGroup = document.getElementById(`emotion-summary-list-${id}`);
  const selected = document.getElementById(`selected-emotion-${id}`);

  listGroup.innerHTML = '';
  selected.innerText = emotion;

  results[id][emotion].summary.forEach(topic => {
    const item = document.createElement('div');
    item.className = 'list-group-item list-group-item-action py-3 lh-sm';
    item.innerHTML = `
      <div class="d-flex w-100 justify-content-between">
        <h6 class="mb-1 fw-semibold text-dark">📈 ${topic.topic_name}</h6>
      </div>
      <p class="mb-1 text-muted small">${topic.summary}</p>`;
    listGroup.appendChild(item);
  });
};
