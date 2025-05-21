var results = {}

const ctx = document.getElementById('myPieChart').getContext('2d');
const myPieChart = new Chart(ctx, {
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

// window.onresize = function() {
//     myPieChart.resize();
//     myPieChart.update();
// };

const socket = io();

window.onload = function () {
  startAnalysis();
};

function startAnalysis() {
    socket.emit('start_analysis_backend');
}

function addDropdownContent(results) {
    const dropdownList = document.querySelector('.topic-description .scrollable-dropdown');
    dropdownList.innerHTML = '';

    Object.keys(results).forEach(emotion => {

        const li = document.createElement('li');
        li.innerHTML = `
            <a class="dropdown-item d-flex align-items-center gap-2 py-2" href="#">
                <span class="d-inline-block bg-info rounded-circle p-1"></span>${emotion}
            </a>
        `;
        dropdownList.appendChild(li);
    })
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

function defaultValuesComponents() {
    const emotion = Object.keys(results)[0];

    updateSummaries(emotion);
}

function updateSelectedEmotion(emotion) {
    const selectedEmotion = document.getElementById('selected-emotion');

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
    const filterInput = document.querySelector('.topic-description .dropdown-menu input[type="search"]');
    const dropdownItems = document.querySelectorAll('.topic-description .scrollable-dropdown li');

    filterInput.addEventListener('input', function () {
        const searchTerm = this.value.toLowerCase();

        dropdownItems.forEach(item => {
            const text = item.textContent.toLowerCase();
            item.style.display = text.includes(searchTerm) ? '' : 'none';
        });
    });
}

function showResults() {
    document.getElementById("loader-container").classList.add("hidden");

    document.getElementById("chart-pie").classList.remove("hidden");
    document.getElementById("topic-description").classList.remove("hidden");

    myPieChart.update();
}

function updatePieChart(results){

    Object.entries(results).forEach(([emotion, data]) => {
        myPieChart.data.labels.push(emotion);
        myPieChart.data.datasets[0]['backgroundColor'].push(getRandomColor())
        myPieChart.data.datasets[0]['data'].push(data.review_count);
    });
}

socket.on('update-results', function(msg) {

    results = msg;

    updatePieChart(results);

    addDropdownContent(results);
    addDropdownItemEventListener();
    addDropdownSearchEventListener();

    defaultValuesComponents();

    showResults()
});

function getRandomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
}