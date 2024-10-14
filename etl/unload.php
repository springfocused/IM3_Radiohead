<?php

// Datenbankkonfiguration einbinden
require_once 'config.php';

// Header setzen, um JSON-Inhaltstyp zurückzugeben
header('Content-Type: application/json');

// Überprüfen, ob der Song-Titel-Parameter in der URL angegeben wurde
if (!isset($_GET['type'])) {
    echo json_encode(['error' => 'Missing type parameter']);
    exit;
}

// Überprüfen, ob der Zeitraum-Parameter in der URL angegeben wurde
if (!isset($_GET['period'])) {
    echo json_encode(['error' => 'Missing period parameter']);
    exit;
}

try {
    // Erstellt eine neue PDO-Instanz mit der Konfiguration aus config.php
    $pdo = new PDO($dsn, $username, $password, $options);

    // Initialisiere die SQL-Abfrage
    $sql = "";
    
    // Zeitraum-Logik hinzufügen
    $whereClause = "";
    switch ($_GET['period']) {
        case 'today':
            $whereClause .= " AND DATE(date) = CURDATE()"; // Nur heute
            break;
        case '7days':
            $whereClause .= " AND date >= NOW() - INTERVAL 7 DAY"; // Letzte 7 Tage
            break;
        case '30days':
            $whereClause .= " AND date >= NOW() - INTERVAL 30 DAY"; // Letzte 30 Tage
            break;
        case 'all':
            // Keine Einschränkung
            break;
        default:
            echo json_encode(['error' => 'Invalid period parameter']);
            exit;
    }

    // Lese den Typ-Parameter aus der URL und baue die SQL-Abfrage
    switch ($_GET['type']) {
        case 'title':
            // SQL-Query für Titel
            $sql = "SELECT title, artist, COUNT(*) as play_count
                    FROM songs
                    WHERE 1=1" . $whereClause . "
                    GROUP BY title, artist
                    ORDER BY play_count DESC";
            break;
        case 'genre':
            // SQL-Query für Genre
            $sql = "SELECT genre, COUNT(*) as play_count
                    FROM songs
                    WHERE genre IS NOT NULL" . $whereClause . "
                    GROUP BY genre
                    ORDER BY play_count DESC
                    LIMIT 20";
            break;
        case 'artist':
            // SQL-Query für Künstler
            $sql = "SELECT artist, COUNT(*) as play_count
                    FROM songs
                    WHERE 1=1" . $whereClause . "
                    GROUP BY artist
                    ORDER BY play_count DESC
                    LIMIT 20";
            break;
        default:
            // Wenn der Typ nicht übereinstimmt, gib eine Fehlermeldung zurück
            echo json_encode(['error' => 'Invalid type parameter']);
            exit;
    }

    // Bereitet die SQL-Anweisung vor
    $stmt = $pdo->prepare($sql);

    // Führt die Abfrage aus
    $stmt->execute();

    // Holt alle passenden Einträge
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Gibt die Ergebnisse im JSON-Format zurück
    echo json_encode($results);
} catch (PDOException $e) {
    // Gibt eine Fehlermeldung zurück, wenn etwas schiefgeht
    echo json_encode(['error' => $e->getMessage()]);
}
