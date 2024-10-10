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
  
      // Log the data in the console
      console.log('Fetched Data:', data);
    } catch (error) {
      // Log any errors in the console
      console.error('Error fetching data:', error);
    }
  }
  
  // Call the function to fetch and log the data
  fetchData();
  