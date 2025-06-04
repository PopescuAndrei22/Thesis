var results = {}

var indexDict = {};

let myPieChart = null;
let myLineChart = null;
let ldaChart = null;

const socket = io();

window.onload = function () {
  startAnalysis();
};

function startAnalysis() {
    socket.emit('start_analysis_backend');
}

function addDropdownContent(results) {
    document.querySelectorAll('.scrollable-dropdown').forEach(dropdownList => {
        dropdownList.innerHTML = '';

        Object.keys(results).forEach(emotion => {
            const li = document.createElement('li');
            li.innerHTML = `
                <a class="dropdown-item d-flex align-items-center gap-2 py-2" href="#">
                    <span class="d-inline-block bg-info rounded-circle p-1"></span>${emotion}
                </a>
            `;
            dropdownList.appendChild(li);
        });
    });
}

function addDropdownItemEventListener() {
    const dropdownItems = document.querySelectorAll('.topic-description .scrollable-dropdown a');

    firstItem = true

    dropdownItems.forEach(dropdownItem => {
        dropdownItem.addEventListener('click', function(event) {
            event.preventDefault();  // Prevent any default action (if necessary)
            
            updateSummaries(dropdownItem.innerText);
        });
    });
}

function addLdaDropdownItemEventListenerLda() {
  const dropdownItems = document.querySelectorAll('#lda-chart .scrollable-dropdown a');

  dropdownItems.forEach(dropdownItem => {
    dropdownItem.addEventListener('click', function (event) {
      event.preventDefault();

      updateLdaChart(dropdownItem.innerText);
    });
  });
}

function addLdaTopicsEventListener(emotion) {
  const dropdownItems = document.querySelectorAll('.lda-dropdown a');

  dropdownItems.forEach(dropdownItem => {
    dropdownItem.addEventListener('click', function (event) {
      event.preventDefault();

      updateLdaChartValues(emotion, dropdownItem.innerHTML);
    });
  });
}

function updateLdaChartValues(emotion, topic) {

  document.getElementById('selected-topic-lda-chart').innerHTML = topic;

  const topicIndex = indexDict[topic];
  const topicObj = results[emotion].topics[topicIndex];

  if (!topicObj) return;

  document.getElementById('selected-topic-lda-chart').innerText = topic;

  const entries = Object.entries(topicObj);

  const sortedEntries = entries
    .sort((a, b) => b[1] - a[1]) // sort descending by weight
    .slice(0, 10); // top 10 keywords (or 5 if preferred)

  const chartLabels = sortedEntries.map(([keyword]) => keyword);
  const chartValues = sortedEntries.map(([, weight]) => parseFloat(weight.toFixed(2)));

  // Update the chart
  ldaChart.data.labels = chartLabels;
  ldaChart.data.datasets[0].data = chartValues;
  ldaChart.update();
}

function updateLdaChart(emotion) {
  updateSelectedEmotionLda(emotion);

  populateTopicDropdown(emotion);

  addLdaTopicsEventListener(emotion);
}

function populateTopicDropdown(emotion) {

  document.querySelectorAll('.lda-dropdown').forEach(dropdownList => {
    dropdownList.innerHTML = '';

    let index = 0;

    results[emotion].summary.forEach(item => {
      const topic_name = item.topic_name;
      const li = document.createElement('li');
      li.innerHTML = `
        <a class="dropdown-item d-flex align-items-center gap-2 py-2" href="#">${topic_name}</a>
      `;
      dropdownList.appendChild(li);
      indexDict[topic_name] = index;
      index++;
    });
  });
}

function defaultValuesComponents() {
    const emotion = Object.keys(results)[0];

    updateSummaries(emotion);
    updateLdaChart(emotion);
}

function updateSelectedEmotion(emotion) {
    const selectedEmotion = document.getElementById('selected-emotion');

    selectedEmotion.innerHTML = emotion;
}

function updateSelectedEmotionLda(emotion) {
    const selectedEmotion = document.getElementById('selected-emotion-lda-chart');

    selectedEmotion.innerHTML = emotion;
}

function updateSummaries(emotion) {
    const listGroup = document.getElementById('emotion-summary-list');
    listGroup.innerHTML = '';

    updateSelectedEmotion(emotion);

    results[emotion].summary.forEach(topic => {
        // Create list item for each topic
        const item = document.createElement('div');
        item.className = 'list-group-item list-group-item-action py-3 lh-sm';
        item.innerHTML = `
            <div class="d-flex w-100 justify-content-between">
                <h6 class="mb-1 fw-semibold text-dark">📈 ${topic.topic_name}</h6>
            </div>
            <p class="mb-1 text-muted small">${topic.summary}</p>
        `;
        listGroup.appendChild(item);  // Append the item to the list
    })
}

function addDropdownSearchEventListener() {
    document.querySelectorAll('.dropdown-menu').forEach(menu => {
        const filterInput = menu.querySelector('input[type="search"]');
        const dropdownItems = menu.querySelectorAll('.scrollable-dropdown li');

        if (!filterInput) return;

        filterInput.addEventListener('input', function () {
            const searchTerm = this.value.toLowerCase();

            dropdownItems.forEach(item => {
                const text = item.textContent.toLowerCase();
                item.style.display = text.includes(searchTerm) ? '' : 'none';
            });
        });
    });
}

function showResults() {
    document.getElementById("loader-container").classList.add("hidden");

    document.getElementById("topic-wrapper").classList.remove("hidden");
    document.getElementById("lda-chart").classList.remove("hidden");
    //document.getElementById("statistics").classList.remove("hidden");
    document.getElementById("nav-bar").classList.remove("hidden");
}

function initializeLdaChart() {
  const ctx = document.getElementById('ldaChart').getContext('2d');

  if (ldaChart) {
    ldaChart.destroy();
  }

  ldaChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: [],
      datasets: [{
        label: 'Keyword Relevance',
        data: [],
        backgroundColor: 'rgba(54, 162, 235, 0.7)',
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: 'LDA Topic Keywords'
        }
      },
      scales: {
        x: {
          beginAtZero: true
        }
      }
    }
  });
}

function initializeChart(){
    const ctx = document.getElementById('myPieChart').getContext('2d');

    if (myPieChart) {
        myPieChart.destroy();
    }

    myPieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: [],
            datasets: [{
                label: 'Numar de recenzii',
                data: [],
                backgroundColor: [
                ],
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Rezultatele analizei'
                }
            }
        },
    });

}

function updatePieChart(results){

    Object.entries(results).forEach(([emotion, data]) => {
        myPieChart.data.labels.push(emotion);
        myPieChart.data.datasets[0]['backgroundColor'].push(getRandomColor())
        myPieChart.data.datasets[0]['data'].push(data.review_count);
    });

    myPieChart.update();
}

function initializeLineChart() {
  const ctx = document.getElementById('myLineChart').getContext('2d');

  if (myLineChart) {
    myLineChart.destroy();
  }

  myLineChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [], // e.g. ["January", "February", "March"]
      datasets: [{
        label: 'Număr de recenzii',
        data: [], // e.g. [10, 20, 15]
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4, // smooth curve
        fill: true,
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Trendul recenziilor'
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Perioadă'
          }
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Număr de recenzii'
          }
        }
      }
    }
  });
}

function updateLineChart(dataPoints) {
  // Example `dataPoints`:
  // { "January": 10, "February": 20, "March": 15 }

  const labels = Object.keys(dataPoints);
  const data = Object.values(dataPoints);

  myLineChart.data.labels = labels;
  myLineChart.data.datasets[0].data = data;
  myLineChart.update();
}

socket.on('update-results', function(msg) {

    results = msg;

    initializeChart();
    initializeLdaChart();

    addDropdownContent(results);
    addDropdownItemEventListener();
    addDropdownSearchEventListener();

    addLdaDropdownItemEventListenerLda();

    defaultValuesComponents();

    showResults();
    
    updatePieChart(results);
});

function getRandomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
}