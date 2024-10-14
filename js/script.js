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
    const url = 'https://springfocused.ch/etl/unload.php?type=genre&period=7days'; // URL für Genres mit dem Zeitraum heute

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

// Funktion zum Abrufen und Anzeigen der Top 3 Songs
async function fetchTopSongs() {
    const url = 'https://springfocused.ch/etl/unload.php?type=title&period=7days'; // URL für die Top Songs der letzten 7 Tage

    try {
        // Daten von der API abrufen
        const response = await fetch(url);
    
        // Überprüfen, ob die Antwort OK ist
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
    
        // Antwort in JSON konvertieren
        const data = await response.json();
    
        // Top 3 Songs sortieren und auswählen
        const top3Data = data.sort((a, b) => b.play_count - a.play_count).slice(0, 3);
    
        // Daten anzeigen
        displayTopSongs(top3Data);
    } catch (error) {
        console.error('Error fetching top songs:', error);
    }
}

// Funktion zum Darstellen der Songs im HTML
function displayTopSongs(songs) {
    const smallSong = document.getElementById('smallSong'); // Container für die Songs
    smallSong.innerHTML = ''; // Vorherigen Inhalt leeren

    // Wenn keine Songs gefunden wurden
    if (songs.length === 0) {
        smallSong.innerHTML = '<p>Keine Songs verfügbar.</p>';
        return;
    }

    // Top 3 Songs als Liste durchlaufen und einfügen
    songs.forEach((song, index) => {
        // Neues div-Element erstellen
        const songElement = document.createElement('div');
        songElement.classList.add('song-item'); // Optional: CSS-Klasse hinzufügen für Styling
        
        // Song-Informationen (Rang, Titel, Künstler, Play Count) einfügen
        songElement.innerHTML = `
            <p><strong>${index + 1}. ${song.title}</strong> von ${song.artist}</p>
        `;
        
        // In den smallSong-Container einfügen
        smallSong.appendChild(songElement);
    });
}

// Beim Laden der Seite die Daten abrufen
fetchTopSongs();
