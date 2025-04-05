function setVanta() {
    if (window.VANTA) {
        window.VANTA.GLOBE({
            el: ".vanta-container", // The container where Vanta effect will appear
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            color: 0xffffff,  // White lines
            backgroundColor: 0x000000 // Black background
        });
    }
}

// Initialize the animation when the page loads
window.onload = setVanta;
const apiUrl = "https://data-analyzer-backend.onrender.com/data";  // Change to your API URL

let globalData = []; // Store data globally
let availableYears = []; // Store available years dynamically

async function fetchData() {
    try {
        const response = await fetch("https://data-analyzer-backend.onrender.com/data");
        const data = await response.json();
        console.log("Fetched Data:", data);  // Debugging

        globalData = data; // Store globally

        // Extract all unique years dynamically
        availableYears = Object.keys(data[0]).filter(key => key !== "tag_name");
        console.log("Available Years:", availableYears);

        const labels = data.map(item => item.tag_name);  // X-axis: Tags

        // Prepare dataset for each year
        const datasets = availableYears.map((year, index) => ({
            label: `Year ${year}`,
            data: data.map(item => item[year]),  // Y-axis values per year
            backgroundColor: getRandomPredefinedColor(index),  // Use predefined colors
            borderColor: getRandomPredefinedColor(index),
            borderWidth: 1
        }));

        console.log("Datasets:", datasets);
        createBarChart(labels, datasets);
        createLineChart(labels, datasets);
        
        // Load the default year for pie chart (first year in dataset)
        updatePieChart(availableYears[0]);

    } catch (error) {
        console.error("Error fetching data:", error);
    }
}


const predefinedColors = [
    "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", 
    "#FF9F40", "#8A2BE2", "#20B2AA", "#DC143C", "#FFD700", '#008000'
];

function getRandomPredefinedColor(index) {
    return predefinedColors[index % predefinedColors.length];  // Cycle through the list
}


let pieChart = null; // Store pie chart instance

function updatePieChart(selectedYear) {
    if (!globalData.length) return;

    const labels = globalData.map(item => item.tag_name);
    const values = globalData.map(item => item[selectedYear] || 0);

    if (pieChart) {
        pieChart.destroy();
    }

    pieChart = new Chart(document.getElementById("pieChart"), {
        type: "pie",
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: labels.map((_, index) => getRandomPredefinedColor(index)) // Pick colors from the list
            }]
        },
        options: {
            responsive: true
        }
    });
}
function createBarChart(labels, datasets) {
    datasets.forEach((dataset, index) => {
        dataset.backgroundColor = getRandomPredefinedColor(index);
        dataset.borderColor = getRandomPredefinedColor(index);
    });

    new Chart(document.getElementById("barChart"), {
        type: "bar",
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

function createLineChart(labels, datasets) {
    datasets.forEach((dataset, index) => {
        dataset.backgroundColor = getRandomPredefinedColor(index);
        dataset.borderColor = getRandomPredefinedColor(index);
    });

    new Chart(document.getElementById("lineChart"), {
        type: "line",
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}


fetchData();
