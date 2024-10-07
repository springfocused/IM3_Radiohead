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

// Call the function to fetch data
fetchDepartures();
