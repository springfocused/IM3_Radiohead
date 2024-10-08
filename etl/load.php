<?php

// Transformations-Skript  als '230_transform.php' einbinden
$dataArray = include('transform.php');


print_r($dataArray);

require_once 'config.php'; // Bindet die Datenbankkonfiguration ein

try {
    // Erstellt eine neue PDO-Instanz mit der Konfiguration aus config.php
    $pdo = new PDO($dsn, $username, $password, $options);

    // SQL-Query für die Überprüfung auf vorhandene Einträge
    $check_sql = "SELECT COUNT(*) FROM songs WHERE date = ?";
    $check_stmt = $pdo->prepare($check_sql);

    // SQL-Query für das Einfügen von Daten
    $sql = "INSERT INTO songs (date, duration, title, isPlayingNow, artist, next_url, genre) VALUES (?, ?, ?, ?, ?, ?, ?)";
    $stmt = $pdo->prepare($sql);

    // Fügt jedes Element im Array in die Datenbank ein
    foreach ($dataArray as $item) {
        // Überprüfen, ob der Eintrag bereits existiert
        $check_stmt->execute([$item['date']]);
        $count = $check_stmt->fetchColumn();

        if ($count == 0) {
            // Einfügen, wenn der Eintrag nicht existiert
            $stmt->execute([
                $item['date'],
                $item['duration'],
                $item['title'],
                $item['isPlayingNow'],
                $item['artist'],
                $item['next_url'],
                $item['genre']
            ]);
        } else {
            echo "Doppelter Eintrag gefunden für das Datum: " . $item['date'] . ". Überspringe diesen Eintrag.<br>";
        }
    }

    echo "Daten erfolgreich eingefügt.";
} catch (PDOException $e) {
    die("Verbindung zur Datenbank konnte nicht hergestellt werden: " . $e->getMessage());
}

?>