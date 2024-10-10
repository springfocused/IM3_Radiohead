// Elemente abrufen
const burger = document.querySelector('.burger');
const menu = document.querySelector('.menu');

// Event-Listener für das Burgermenü
burger.addEventListener('click', toggleMenu);

function toggleMenu() {
    menu.classList.toggle('active');
    burger.classList.toggle('open');
}


// Define an asynchronous function to fetch data from the endpoint
async function fetchData() {
    const url = 'https://springfocused.ch/etl/unload.php?type=title';
  
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

// Daten durchlaufen und HTML für jeden Eintrag erstellen
data.forEach((item, index) => {
    // Neues div für jeden Song erstellen
    const titleElement = document.createElement('div');
    
    // ID des Songs als data-Attribut setzen
    titleElement.setAttribute('data-id', item.id);

    // Füge eine CSS-Klasse hinzu
    titleElement.classList.add('song-item');
    
    // HTML-Struktur erstellen, die den Titel und die Wiedergabezahlen enthält
    titleElement.innerHTML = `
        <p>${index + 1}. ${item.title} ${item.artist} ${item.play_count}</p>
    `;
    
    // Füge das erstellte Element in den Top Songs-Container ein
    topSongs.appendChild(titleElement);
});
}

// Funktion zum Abrufen der Daten aufrufen
fetchData();