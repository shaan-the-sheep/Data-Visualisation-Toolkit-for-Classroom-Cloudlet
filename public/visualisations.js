let chart = null;

// Initialization function to set up event listeners
function initializeChartEventListeners() {
    document.getElementById('temperature-legend-color').addEventListener('input', () => updateLegendColor('Temperature (°C)'));
    document.getElementById('wind-legend-color').addEventListener('input', () => updateLegendColor('Wind speed (mph)'));
    document.getElementById('chart-type-select').addEventListener('change', updateChart);
  
    document.querySelectorAll('.data-options input[type="checkbox"]').forEach(checkbox => {
      checkbox.addEventListener('change', updateChart);
    });
  }

// Function to display the chart based on the selected type and data
function displayChart(chartType, labels, datasets) {
    const ctx = document.getElementById('chart').getContext('2d');
    if (chart) {
        chart.destroy();
    }
    chart = new Chart(ctx, {
        type: chartType,
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: Math.ceil(Math.max(...datasets.flatMap(dataset => dataset.data)) / 10) * 10
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        color: '#333'
                    }
                }
            }
        }
    });
}

// Function to update the chart based on the selected datasets
function updateChart() {
    const chartType = document.getElementById('chart-type-select').value;
    const datasets = getSelectedDatasets();
    if (chart) {
        chart.destroy();
    }
    if (datasets.length > 0) {
        displayChart(chartType, timeLabels, datasets);
    }
}

// Function to get selected datasets based on user input
function getSelectedDatasets() {
    const datasets = [];
    if (document.getElementById('temperature-checkbox').checked) {
        datasets.push({
            label: 'Temperature (°C)',
            data: temperatureData,
            backgroundColor: document.getElementById('temperature-legend-color').value,
            borderColor: document.getElementById('temperature-legend-color').value,
            borderWidth: 1
        });
    }
    if (document.getElementById('wind-checkbox').checked) {
        datasets.push({
            label: 'Wind speed (mph)',
            data: windData,
            backgroundColor: document.getElementById('wind-legend-color').value,
            borderColor: document.getElementById('wind-legend-color').value,
            borderWidth: 1
        });
    }
    return datasets;
}


// Utility function to update the legend color of the chart
function updateLegendColor(label, color) {
    if (chart) {
        chart.data.datasets.forEach(dataset => {
            if (dataset.label === label) {
                dataset.backgroundColor = color;
                dataset.borderColor = color;
            }
        });
        chart.update();
    }
}

initializeChartEventListeners();