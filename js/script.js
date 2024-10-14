// Elemente abrufen
const burger = document.querySelector('.burger');
const menu = document.querySelector('.menu');

// Event-Listener für das Burgermenü
burger.addEventListener('click', toggleMenu);

function toggleMenu() {
    menu.classList.toggle('active');
    burger.classList.toggle('open');
}

// URL of the API you want to fetch data from
const url = 'https://il.srgssr.ch/integrationlayer/2.0/srf/songList/radio/byChannel/69e8ac16-4327-4af4-b873-fd5cd6e895a7';

// Function to fetch data and log it to the console
async function fetchDepartures() {
  try {
    const response = await fetch(url); // Fetch data from the API
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`); // Corrected string interpolation
    }
    const data = await response.json(); // Parse the JSON from the response
    console.log(data); // Log the fetched data to the console
  } catch (error) {
    console.error('Error fetching data:', error); // Log errors to the console
  }
}
// Elemente abrufen
const smallGenresChart = document.getElementById('smallGenresChart'); // Canvas-Element für das kleine Diagramm

// Define an asynchronous function to fetch data from the endpoint
async function fetchTopGenres() {
    const url = 'https://springfocused.ch/etl/unload.php?type=genre&period=today'; // URL für Genres mit dem Zeitraum heute

    try {
        // Fetch the data from the endpoint
        const response = await fetch(url);
    
        // Check if the response status is OK (200-299)
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
    
        // Parse the response as JSON
        const data = await response.json();
    
        // Sort data by play_count and slice to get the top 3 genres
        const top3Data = data.sort((a, b) => b.play_count - a.play_count).slice(0, 3);
    
        // Create the chart with top 3 genres
        createSmallGenresChart(top3Data);
    } catch (error) {
        // Log any error in the console
        console.error('Error fetching genres:', error);
    }
}

// Funktion zum Erstellen des kleinen Diagramms mit Genres-Daten
function createSmallGenresChart(data) {
    // Daten für das Diagramm vorbereiten
    const labels = data.map(item => item.genre); // Genres als Labels
    const playCounts = data.map(item => item.play_count); // Abgespielte Songs als Werte

    // Chart.js Balkendiagramm erstellen
    new Chart(smallGenresChart, {
        type: 'bar', // Balkendiagramm
        data: {
            labels: labels, // Labels für die Genres
            datasets: [{
                label: 'Top 3 Abgespielte Songs',
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
                        font: {
                            size: 18,  // Kleinere Schriftgröße
                            family: 'bangers',  // Schriftart
                        }
                    }
                },
                y: {
                    beginAtZero: true // Y-Achse beginnt bei 0
                }
            }
        }
    });
}

// Funktion zum Abrufen und Anzeigen der Genres-Daten aufrufen
fetchTopGenres(); // Initialer Aufruf der Funktion um die heutigen Daten beim Laden der Seite zu holen
