// Elemente abrufen
const burger = document.querySelector('.burger');
const menu = document.querySelector('.menu');
const dropdown = document.getElementById('time-period'); // Dropdown-Element abrufen
const topSongs = document.getElementById('topSongs'); // Container für Top-Songs abrufen

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
    const url = `https://springfocused.ch/etl/unload.php?type=title&period=${selectedValue}`; // URL dynamisch basierend auf der Auswahl erstellen
  
    try {
        // Fetch the data from the endpoint
        const response = await fetch(url);
    
        // Check if the response status is OK (200-299)
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
    
        // Parse the response as JSON
        const data = await response.json();
    
        // Daten im Top Songs-Container anzeigen
        displayData(data);
    } catch (error) {
        // Fehler im Konsolenprotokoll anzeigen
        console.error('Error fetching data:', error);
        topSongs.innerHTML = `<p>Fehler beim Laden der Daten.</p>`;
    }
}

// Funktion zum Einfügen der Daten in den Container mit der ID 'topsongs'
function displayData(data) {
    // Inhalt des Containers leeren
    topSongs.innerHTML = '';

    // Überprüfen, ob Daten vorhanden sind
    if (data.length === 0) {
        topSongs.innerHTML = '<p>Keine Daten gefunden.</p>';
        return;
    }

const limitedData = data.slice(0, 20);

    // Daten durchlaufen und HTML für jeden Eintrag erstellen
    limitedData.forEach((item, index) => {
        // Neues div für jeden Song erstellen
        const titleElement = document.createElement('div');
        
        // ID des Songs als data-Attribut setzen
        titleElement.setAttribute('data-id', item.id);

        // Füge eine CSS-Klasse hinzu
        titleElement.classList.add('song-item');
        
        // HTML-Struktur erstellen, die den Titel und die Wiedergabezahlen enthält
        titleElement.innerHTML = `
            <div class="song-rank"><p>${index + 1}</p></div>
            <div class="song-title"><p>${item.title}</p></div>
            <div class="song-artist"><p>${item.artist}</p></div>
            <div class="song-plays"><p>${item.play_count}</p></div>
        `;
        // Füge das erstellte Element in den Top Songs-Container ein
        topSongs.appendChild(titleElement);
    });
}

// Funktion zum Abrufen der Daten beim Laden der Seite aufrufen
fetchData();
