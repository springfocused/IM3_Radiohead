// Elemente abrufen
const burger = document.querySelector('.burger');
const menu = document.querySelector('.menu');

// Event-Listener für das Burgermenü
burger.addEventListener('click', toggleMenu);

function toggleMenu() {
    menu.classList.toggle('active');
    burger.classList.toggle('open');
}

// URL der API zum Abrufen des aktuell gespielten Songs (via Backend)
const songUrl = 'https://il.srgssr.ch/integrationlayer/2.0/srf/songList/radio/byChannel/69e8ac16-4327-4af4-b873-fd5cd6e895a7'; // Backend-URL für die Song-Daten

let currentSongId = null; // Globale Variable für die Spotify Track ID

// Funktion zum Abrufen des aktuell gespielten Songs
async function fetchCurrentSong() {
  try {
    const response = await fetch(songUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const currentSong = data.songList.find(song => song.isPlayingNow === true);

    const songDisplay = document.getElementById('currentSong');
    songDisplay.innerHTML = '';

    if (currentSong) {
      // Jetzt wird die Spotify Track ID verwendet
      currentSongId = currentSong.spotifyTrackId; 

      // Zeige den Titel des aktuellen Songs an
      songDisplay.innerHTML = `<h3>Jetzt läuft: <strong>${currentSong.title}</strong></h3>`;

      // Setze den Spotify Iframe src, wenn die currentSongId erfolgreich abgerufen wurde
      if (currentSongId) {
        document.getElementById('spotifyIframe').src = `https://open.spotify.com/embed/track/${currentSongId}`;
      }
    } else {
      currentSongId = null;
      songDisplay.innerHTML = '<h3>Momentan wird kein Lied gespielt</h3>';
    }

  } catch (error) {
    console.error('Error fetching current song:', error);
    document.getElementById('currentSong').innerHTML = '<p>Fehler beim Laden des aktuellen Songs.</p>';
  }
}


// Funktion zum Abrufen der Spotify Track ID über das Backend (transform.php)
async function getSpotifyTrackIdFromBackend(title, artist) {
  try {
    const response = await fetch('https://springfocused.ch/etl/transform.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title: title, artist: artist })
    });

    if (!response.ok) {
      throw new Error('Fehler beim Abrufen der Spotify-Track-ID');
    }

    const data = await response.json();
    if (data.spotifyTrackId) {
      return data.spotifyTrackId; // Rückgabe der gefundenen Spotify-Track-ID
    } else {
      console.log('Keine Spotify-Track-ID im Backend gefunden');
      return null;
    }
  } catch (error) {
    console.error('Fehler beim Abrufen der Spotify-Track-ID vom Backend:', error);
    return null;
  }
}

// Funktion zur Steuerung des Play-Buttons
function setupPlayButton() {
  const playButton = document.getElementById('playSongButton');
  const spotifyIframe = document.getElementById('spotifyIframe');

  playButton.addEventListener('click', function() {
    if (currentSongId) {
      // Überprüfen, ob der Button gerade im "play"-Zustand ist
      if (playButton.classList.contains('play')) {
        playButton.classList.remove('play');
        playButton.classList.add('stop');
        // Starte den aktuellen Song über das Spotify-Embed
        spotifyIframe.src = `https://open.spotify.com/embed/track/${currentSongId}`;
      } else {
        playButton.classList.remove('stop');
        playButton.classList.add('play');
        // Stoppe den Song (setze die iframe src zurück)
        spotifyIframe.src = ''; 
      }
    } else {
      alert('Es wird gerade kein Song abgespielt.');
    }
  });
}

// Initialisiere die Seite und Play-Button
fetchCurrentSong(); // Lade den aktuellen Song
setupPlayButton();  // Setze den Event Listener für den Play-Button


//------------------ Kleine Vorschau-Container ------------------

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

// Top Songs
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



// Top Genres
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
                      color: '#ffff', 
                        maxRotation: 60, // Maximale Drehung
                        minRotation: 60, // Feste 90° Drehung für vertikalen Text
                        font: {
                            size: 18,  // Kleinere Schriftgröße
                            family: 'bangers',  // Schriftart
                        }
                    },
                    grid: {
                      display: false, // Keine horizontalen Linien für die X-Achse
                  },
                  border: {
                      color: '#ffffff' // Nur eine Linie für die X-Achse
                  }
                },

                y: {
                    beginAtZero: true, // Y-Achse beginnt bei 0
                    ticks: {
                      color: '#ffffff', // Farbe der Y-Achse Schrift auf Weiß setzen
                  },
                  grid: {
                      display: false, // Keine vertikalen Linien für die Y-Achse
                  },
                  border: {
                      color: '#ffffff' // Nur eine Linie für die Y-Achse
                  }
                }
            },
             plugins: {
        legend: {
            display: false, // Legende ausblenden
        }
    }
        }
    });
}

// Funktion zum Abrufen und Anzeigen der Genres-Daten aufrufen
fetchTopGenres(); // Initialer Aufruf der Funktion um die heutigen Daten beim Laden der Seite zu holen



// Top Artists
const smallArtistChart = document.getElementById('smallArtistChart'); // Canvas-Element für das kleine Diagramm

// Define an asynchronous function to fetch data from the endpoint
async function fetchTopArtist() {
    const url = 'https://springfocused.ch/etl/unload.php?type=artist&period=7days'; // URL für Genres mit dem Zeitraum heute

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
        createSmallArtistChart(top3Data);
    } catch (error) {
        // Log any error in the console
        console.error('Error fetching artists:', error);
    }
}

// Funktion zum Erstellen des kleinen Diagramms mit Genres-Daten
function createSmallArtistChart(data) {
    // Daten für das Diagramm vorbereiten
    const labels = data.map(item => item.artist); // Genres als Labels
    const playCounts = data.map(item => item.play_count); // Abgespielte Songs als Werte

    // Chart.js Balkendiagramm erstellen
    new Chart(smallArtistChart, {
        type: 'bar', // Balkendiagramm
        data: {
            labels: labels, // Labels für die Genres
            datasets: [{
                label: 'Top 3 Artists',
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
                      color: '#ffff', 
                        maxRotation: 0, // Maximale Drehung
                        font: {
                            size: 18,  // Kleinere Schriftgröße
                            family: 'bangers',  // Schriftart
                        }
                    },
                    grid: {
                      display: false, // Keine horizontalen Linien für die X-Achse
                  },
                  border: {
                    display: false, // Nur eine Linie für die X-Achse
                  }
                },

                y: {
                    beginAtZero: true, // Y-Achse beginnt bei 0
                    ticks: {
                      display: false, // Farbe der Y-Achse Schrift auf Weiß setzen
                  },
                  grid: {
                      display: false, // Keine vertikalen Linien für die Y-Achse
                  },
                  border: {
                    display: false, // Nur eine Linie für die Y-Achse
                  }
                }
            }, 
            plugins: {
              legend: {
                  display: false, // Legende ausblenden
              }
          }
        }
    });
}

// Funktion zum Abrufen und Anzeigen der Genres-Daten aufrufen
fetchTopArtist(); // Initialer Aufruf der Funktion um die heutigen Daten beim Laden der Seite zu holen


