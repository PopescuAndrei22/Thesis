import { indexDict, results, setMyPieChart, sharedState } from '../state.js';
import { updateLdaChartData } from '../charts/ldaChart.js';

export const addLdaDropdowns = (id) => {
  document.querySelectorAll(`#lda-chart-${id} .scrollable-dropdown-${id} a`).forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const emotion = item.innerText;
      updateLdaChart(id, emotion);
    });
  });
};

export const updateLdaChart = (id, emotion) => {
  updateSelectedEmotionLda(id, emotion);
  populateTopicDropdown(id, emotion);
  bindTopicEventHandlers(id, emotion);

  const firstTopic = results[id][emotion].summary[0]?.topic_name;
  if (firstTopic) {
    updateTopicData(id, emotion, firstTopic);
  }
};

const updateSelectedEmotionLda = (id, emotion) => {
  document.getElementById(`selected-emotion-lda-chart-${id}`).innerText = emotion;
};

const populateTopicDropdown = (id, emotion) => {
  document.querySelectorAll(`#lda-topic-dropdown-${id}`).forEach(dropdown => {
    dropdown.innerHTML = '';

    results[id][emotion].summary.forEach((item, index) => {
      const li = document.createElement('li');
      li.innerHTML = `<a class="dropdown-item d-flex align-items-center gap-2 py-2" href="#">${item.topic_name}</a>`;
      dropdown.appendChild(li);
      indexDict[id][item.topic_name] = index;
    });
  });
};

const bindTopicEventHandlers = (id, emotion) => {
  document.querySelectorAll(`#lda-topic-dropdown-${id} a`).forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const topic = item.innerText;
      updateTopicData(id, emotion, topic);
    });
  });
};

const updateTopicData = (id, emotion, topic) => {
  document.getElementById(`selected-topic-lda-chart-${id}`).innerText = topic;

  const topicIndex = indexDict[id][topic];
  const topicObj = results[id][emotion].topics[topicIndex];
  if (!topicObj) return;

  const entries = Object.entries(topicObj)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const labels = entries.map(([k]) => k);
  const values = entries.map(([, v]) => parseFloat(v.toFixed(2)));

  updateLdaChartData({ labels, values }, id);
};
