// Elemente abrufen
const burger = document.querySelector('.burger');
const menu = document.querySelector('.menu');
const genresChart = document.getElementById('genresChart'); // Canvas-Element für das Diagramm

// Event-Listener für das Burgermenü
burger.addEventListener('click', toggleMenu);

function toggleMenu() {
    menu.classList.toggle('active');
    burger.classList.toggle('open');
}

// Define an asynchronous function to fetch data from the endpoint
async function fetchGenres() {
    const url = 'https://springfocused.ch/etl/unload.php?type=genre'; // URL für Genres

    try {
        // Fetch the data from the endpoint
        const response = await fetch(url);
    
        // Check if the response status is OK (200-299)
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
    
        // Parse the response as JSON
        const data = await response.json();
    
        // Create the chart with fetched data
        createGenresChart(data);
    } catch (error) {
        // Log any error in the console
        console.error('Error fetching genres:', error);
    }
}

// Function to create a chart with genres data
function createGenresChart(data) {
    // Prepare data for the chart
    const labels = data.map(item => item.genre); // Genres als Labels
    const playCounts = data.map(item => item.play_count); // Abgespielte Songs als Werte

    // Chart.js erstellen
    new Chart(genresChart, {
        type: 'bar', // Balkendiagramm
        data: {
            labels: labels, // Labels für die Genres
            datasets: [{
                label: 'Abgespielte Songs',
                data: playCounts, // Werte für die Genres
                backgroundColor: '#f2e206', // Gelbe Balkenfarbe
                borderColor: '#f2e206', // Gelber Rand
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                x: {
                    ticks: {
                        maxRotation: 90, // Maximale Drehung
                        minRotation: 90, // Feste 90° Drehung für vertikalen Text
                    }
                },
                y: {
                    beginAtZero: true // Y-Achse bei 0 beginnen
                }
            }
        }
    });
}

// Call the function to fetch and display the genres data when the page loads
fetchGenres();
