import { indexDict, results } from '../state.js';
import { updateLdaChartData } from '../charts/ldaChart.js';

export const addLdaDropdowns = (results) => {
  document.querySelectorAll('#lda-chart .scrollable-dropdown a').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const emotion = item.innerText;
      updateLdaChart(emotion);
    });
  });
};

export const updateLdaChart = (emotion) => {
  updateSelectedEmotionLda(emotion);
  populateTopicDropdown(emotion);
  bindTopicEventHandlers(emotion);
};

const updateSelectedEmotionLda = (emotion) => {
  document.getElementById('selected-emotion-lda-chart').innerText = emotion;
};

const populateTopicDropdown = (emotion) => {
  document.querySelectorAll('.lda-dropdown').forEach(dropdown => {
    dropdown.innerHTML = '';

    results[emotion].summary.forEach((item, index) => {
      const li = document.createElement('li');
      li.innerHTML = `<a class="dropdown-item d-flex align-items-center gap-2 py-2" href="#">${item.topic_name}</a>`;
      dropdown.appendChild(li);
      indexDict[item.topic_name] = index;
    });
  });
};

const bindTopicEventHandlers = (emotion) => {
  document.querySelectorAll('.lda-dropdown a').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const topic = item.innerText;
      updateTopicData(emotion, topic);
    });
  });
};

const updateTopicData = (emotion, topic) => {
  document.getElementById('selected-topic-lda-chart').innerText = topic;

  const topicIndex = indexDict[topic];
  const topicObj = results[emotion].topics[topicIndex];
  if (!topicObj) return;

  const entries = Object.entries(topicObj)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const labels = entries.map(([k]) => k);
  const values = entries.map(([, v]) => parseFloat(v.toFixed(2)));

  updateLdaChartData({ labels, values });
};
