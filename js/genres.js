// Elemente abrufen
const burger = document.querySelector('.burger');
const menu = document.querySelector('.menu');
const dropdown = document.getElementById('time-period'); // Dropdown für die Zeiträume
const genresChart = document.getElementById('genresChart'); // Canvas-Element für das Diagramm
let genresChartInstance; // Variable für das Chart-Objekt

// Event-Listener für das Burgermenü
burger.addEventListener('click', toggleMenu);

function toggleMenu() {
    menu.classList.toggle('active');
    burger.classList.toggle('open');
}

// Event-Listener für Dropdown-Auswahl
dropdown.addEventListener('change', fetchData); // Funktion wird beim Ändern des Dropdowns aufgerufen

// Define an asynchronous function to fetch data from the endpoint
async function fetchData() {
    const selectedValue = dropdown.value; // Den aktuellen Wert des Dropdowns abrufen
    const url = `https://springfocused.ch/etl/unload.php?type=genre&period=${selectedValue}`; // URL dynamisch basierend auf der Auswahl erstellen

    try {
        // Fetch the data from the endpoint
        const response = await fetch(url);
    
        // Check if the response status is OK (200-299)
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
    
        // Parse the response as JSON
        const data = await response.json();
    
        // Daten im Diagramm anzeigen
        createGenresChart(data);
    } catch (error) {
               // Log any error in the console
               console.error('Error fetching genres:', error);
    }
}

// Funktion zum Erstellen des Diagramms mit Genres-Daten
function createGenresChart(data) {
    // Daten für das Diagramm vorbereiten
    const labels = data.map(item => item.genre); // Genres als Labels
    const playCounts = data.map(item => item.play_count); // Abgespielte Songs als Werte

        // Überprüfen, ob das Chart-Objekt bereits existiert und es aktualisieren
        if (genresChartInstance) {
            genresChartInstance.destroy(); // Zerstöre das bestehende Chart-Objekt
        }

    // Chart.js Balkendiagramm erstellen
    genresChartInstance = new Chart(genresChart, {
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
                        font: {
                            size: 24,  // Schriftgröße wie bei <h2>
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
fetchData(); // Initialer Aufruf der Funktion um die Daten beim Laden der Seite zu holen

