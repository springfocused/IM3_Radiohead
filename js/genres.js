// Elemente abrufen
const burger = document.querySelector('.burger');
const menu = document.querySelector('.menu');
const topgenres = document.getElementById('topGenres'); // Container für Genres

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
    
        // Display the fetched genres data
        displayGenres(data);
    } catch (error) {
        // Log any error in the console
        console.error('Error fetching genres:', error);
        topGenres.innerHTML = '<p>Fehler beim Laden der Genres.</p>';
    }
}

// Function to display the fetched genres data
function displayGenres(data) {
    // Clear the container content
    topGenres.innerHTML = '';
    
    // Check if there is any data
    if (data.length === 0) {
        topGenres.innerHTML = '<p>Keine Genres gefunden.</p>';
        return;
    }
    
    // Loop through the genres data and create HTML for each item
    data.forEach((item, index) => {
        // Create a new div element for each genre
        const genreElement = document.createElement('div');
        
        // Set the genre ID as a data attribute
        genreElement.setAttribute('data-id', item.id);
        
        // Add a CSS class
        genreElement.classList.add('genre-item');
        
        // Create the HTML structure for each genre
        genreElement.innerHTML = `
            <h2>${index + 1}. ${item.genre}</h2>
            <p>Beliebtheit: ${item.popularity}</p>
        `;
        
        // Append the genre element to the container
        topGenres.appendChild(genreElement);
    });
}

// Call the function to fetch and display the genres data when the page loads
fetchGenres();
