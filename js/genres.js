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

/// Event-Listener für Dropdown-Auswahl
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

    // Media Query für kleine Bildschirme
    const mediaQuery = window.matchMedia('(max-width: 768px)');

    // Standard-Chart-Optionen für größere Bildschirme
    let chartOptions = {
        scales: {
            x: {
                ticks: {
                    color: '#ffffff', // Farbe der X-Achse Schrift auf Weiß setzen
                    maxRotation: 60, // Maximale Rotation der X-Achsen-Beschriftung (60 Grad)
                    minRotation: 60, // Minimale Rotation der X-Achsen-Beschriftung (60 Grad)
                    font: {
                        size: 18,
                        family: 'bangers', // Bangers-Schriftart setzen
                    }
                },
                grid: {
                    display: false, // Keine horizontalen Linien für die X-Achse
                },
                border: {
                    color: '#ffffff' // Nur eine Linie für die X-Achse
                },
                title: {
                    display: true,
                    text: 'Genre',
                    color: '#f2e206', // Textfarbe Weiß
                    font: {
                        size: 36,
                        family: 'bangers', // Bangers-Schriftart
                    }
                }
            },
            y: {
                beginAtZero: true, // Y-Achse beginnt bei 0
                ticks: {
                    color: '#ffffff', // Farbe der Y-Achse Schrift auf Weiß setzen
                    font: {
                        family: 'bangers', // Bangers-Schriftart
                    }
                },
                grid: {
                    display: false, // Keine vertikalen Linien für die Y-Achse
                },
                border: {
                    color: '#ffffff' // Nur eine Linie für die Y-Achse
                },
                title: {
                    display: true,
                    text: 'Times Played',
                    color: '#f2e206', // Textfarbe Weiß
                    font: {
                        size: 36,
                        family: 'bangers', // Bangers-Schriftart
                    },
                    padding: { top: 10 }, // Abstand nach oben
                    position: 'center',
                    rotation: 90, // Vertikale Ausrichtung des Y-Achsentitels
                }
            }
        },
        plugins: {
            legend: {
                display: false, // Legende ausblenden
            }
        }
    };

    // Wenn die Media Query zutrifft, passe die Chart-Optionen an
    if (mediaQuery.matches) {
        chartOptions = {
            scales: {
                y: {
                    beginAtZero: true, // Y-Achse beginnt bei 0
                    ticks: {
                        color: '#ffffff', // Farbe der Y-Achse Schrift auf Weiß setzen
                        font: {
                            size: 15, // Größe der Schrift für kleine Bildschirme
                            family: 'bangers', // Bangers-Schriftart setzen
                        }
                    },
                    grid: {
                        display: false, // Keine vertikalen Linien für die Y-Achse
                    },
                    border: {
                        color: '#ffffff' // Nur eine Linie für die Y-Achse
                    },
                    title: {
                        display: true,
                        text: 'Genres',
                        color: '#f2e206', // Textfarbe Weiß
                        font: {
                            size: 24,
                            family: 'bangers', // Bangers-Schriftart
                        },
                        padding: { top: 10 }, // Abstand nach oben
                        position: 'top', // Jetzt über der Y-Achse
                        rotation: -15, // Keine Rotation des Y-Achsentitels
                    }
                },
                x: {
                    ticks: {
                        color: '#ffffff', // Farbe der Y-Achse Schrift auf Weiß setzen
                        font: {
                            size: 15, // Schriftgröße
                            family: 'bangers', // Schriftart
                        }
                    },
                    grid: {
                        display: false, // Keine horizontalen Linien für die X-Achse
                    },
                    border: {
                        color: '#ffffff' // Nur eine Linie für die X-Achse
                    },
                    title: {
                        display: true,
                        text: 'Times Played',
                        color: '#f2e206', // Textfarbe Weiß
                        font: {
                            size: 24,
                            family: 'bangers', // Bangers-Schriftart
                        }
                    }
                }
            },
            indexAxis: 'y', // Ändert die Ausrichtung der Balken (horizontal)
            plugins: {
                legend: {
                    display: false, // Legende ausblenden
                }
            },
            elements: {
                bar: {
                    barThickness: 40, // Nur in den Media Queries anwenden
                }
            }
        };

        genresChart.style.height = '500px';
        
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
            ...chartOptions,
            maintainAspectRatio: false, // Stellt sicher, dass die Höhe angepasst werden kann
        }
    });


}

// Funktion zum Abrufen und Anzeigen der Genres-Daten aufrufen
fetchData(); // Initialer Aufruf der Funktion um die Daten beim Laden der Seite zu holen
