<?php

// Datenbankkonfiguration einbinden
require_once 'config.php';

// Header setzen, um JSON-Inhaltstyp zurückzugeben
header('Content-Type: application/json');

// Überprüfen, ob der Song-Titel-Parameter in der URL angegeben wurde
// https://springfocused.ch/etl/unload.php?type=title
// https://springfocused.ch/etl/unload.php?type=genre
// https://springfocused.ch/etl/unload.php?type=artist
//check if type parameter is set
if (!isset($_GET['type'])) {
    // Wenn nicht, gib eine Fehlermeldung zurück
    echo json_encode(['error' => 'Missing type parameter']);
    exit;
}


try {
    // Erstellt eine neue PDO-Instanz mit der Konfiguration aus config.php
    $pdo = new PDO($dsn, $username, $password, $options);

    // read the type parameter from the URL
    // make a switch statement to handle different cases
    switch ($_GET['type']) {
        case 'title':
            // SQL-Query, um Daten
            $sql = "SELECT title, COUNT(*) as play_count
            FROM songs
            GROUP BY title
            ORDER BY play_count DESC
            LIMIT 20";
            break;
        case 'genre':
            // SQL-Query, um Daten basierend auf dem Genre auszuwählen, sortiert nach Zeitstempel
            $sql = "SELECT genre, COUNT(*) as play_count
            FROM songs
            WHERE genre IS NOT NULL
            GROUP BY genre
            ORDER BY play_count DESC
            LIMIT 20";
            break;
        case 'artist':
            // SQL-Query, um Daten basierend auf dem Künstler auszuwählen, sortiert nach Zeitstempel
            $sql = "SELECT artist, COUNT(*) as play_count
            FROM songs
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

    // Führt die Abfrage mit der Standortvariablen aus, die in einem Array übergeben wird
    // Die Standortvariable ersetzt das erste Fragezeichen in der SQL-Anweisung
    $stmt->execute();

    // Holt alle passenden Einträge
    $results = $stmt->fetchAll();

    // Gibt die Ergebnisse im JSON-Format zurück
    echo json_encode($results);
} catch (PDOException $e) {
    // Gibt eine Fehlermeldung zurück, wenn etwas schiefgeht
    echo json_encode(['error' => $e->getMessage()]);
}