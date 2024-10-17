<?php
// SRF API-Daten abrufen
function fetchSRFData() {
    $url = "https://il.srgssr.ch/integrationlayer/2.0/srf/songList/radio/byChannel/69e8ac16-4327-4af4-b873-fd5cd6e895a7";
    
    // Initialisiert eine cURL-Sitzung
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    // Führt die cURL-Sitzung aus und erhält den Inhalt
    $response = curl_exec($ch);
    curl_close($ch);

    // Dekodiert die JSON-Antwort und gibt Daten zurück
    return json_decode($response, true);
}

// Deine Spotify Client ID und Secret
$client_id = '3159add0e2324c97b875e16bdf8e94b4'; // Ersetze dies mit deiner Client ID
$client_secret = '5a3cff0ff75e447c8674d2cc4634e707'; // Ersetze dies mit deinem Client Secret

// Funktion, um das Spotify-Access-Token abzurufen
function getSpotifyAccessToken($client_id, $client_secret) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, "https://accounts.spotify.com/api/token");
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
        'Authorization: Basic ' . base64_encode($client_id . ':' . $client_secret)
    ));
    curl_setopt($ch, CURLOPT_POSTFIELDS, 'grant_type=client_credentials');

    $response = curl_exec($ch);
    curl_close($ch);

    $token_info = json_decode($response, true);
    return $token_info['access_token'] ?? null; // Gib das Token zurück oder null
}

// Funktion, um nach einem Song zu suchen
function searchSong($song_name, $artist_name, $access_token) {
    $search_url = "https://api.spotify.com/v1/search?q=" . urlencode($song_name . " artist:" . $artist_name) . "&type=track";

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $search_url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
        'Authorization: Bearer ' . $access_token
    ));

    $result = curl_exec($ch);
    curl_close($ch);

    return json_decode($result, true); // Gibt die Antwort zurück
}

// Funktion zum Abrufen der Genres eines Tracks
function getGenresFromTrack($track, $access_token) {
    $artist_id = $track['artists'][0]['id'] ?? null;
    if ($artist_id) {


        $genres = getArtistGenres($artist_id, $access_token);

        return !empty($genres) ? $genres : null; // Gibt Genres zurück oder NULL, wenn keine gefunden werden
    }
    return null; // Kein Genre gefunden, gibt NULL zurück
}

// Funktion zum Abrufen der Genres eines Künstlers
function getArtistGenres($artist_id, $access_token) {
    $artist_url = "https://api.spotify.com/v1/artists/{$artist_id}";

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $artist_url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
        'Authorization: Bearer ' . $access_token
    ));

    $result = curl_exec($ch);
    curl_close($ch);


    $artist_info = json_decode($result, true);
    
    // Falls keine Genres vorhanden sind, null zurückgeben
    if (empty($artist_info['genres'])) {
        return NULL;
    }

// Liste der bevorzugten Genres
$preferred_genres = [
    'rock', 'pop', 'metal', 'techno', 'hip hop', 'jazz', 'classical', 
    'blues', 'country', 'reggae', 'soul', 'funk', 'house', 
    'disco', 'punk', 'alternative', 'indie', 'trap', 
    'r&b', 'dubstep', 'electronic', 'folk', 'grunge', 'salsa',
    'latin', 'k-pop', 'gospel', 'trance', 'drum and bass', 'progressive', 
    'ambient', 'industrial', 'singer-songwriter', 'reggaeton', 'mellow'
];


    // Durchsuche die Genres nach Übereinstimmungen mit den bevorzugten Genres
    foreach ($artist_info['genres'] as $genre) {
        foreach ($preferred_genres as $preferred_genre) {
            if (stripos($genre, $preferred_genre) !== false) {
                return $preferred_genre; // Gib das bevorzugte Genre zurück
            }
        }
    }

    // Falls kein bevorzugtes Genre gefunden wurde, gib das erste Genre zurück
    return $artist_info['genres'][0] ?? null;
}


// SRF-Daten abrufen
$srf_data = fetchSRFData();
$access_token = getSpotifyAccessToken($client_id, $client_secret);

// Initialisiert ein Array, um die transformierten Daten zu speichern
$transformedData = [];

// Durchläuft die SRF-Daten und transformiert sie
foreach ($srf_data['songList'] as $song) {
    $title = $song['title'];
    $artist_name = $song['artist']['name'];

    // Genre von Spotify abrufen
    $tracks = searchSong($title, $artist_name, $access_token);

     // Die Spotify Track-ID speichern
 $spotifyTrackId = $track['id'] ?? null; // Track ID von Spotify

    // Überprüfen, ob Tracks gefunden wurden
    if (!empty($tracks['tracks']['items'])) {
        $track = $tracks['tracks']['items'][0]; // Nimm den ersten Track

        // Genres des Tracks abrufen
        $genres = getGenresFromTrack($track, $access_token);

        // Fügt die transformierten Daten dem Array hinzu
        $transformedData[] = [
            'date' => date('Y-m-d H:i:s', strtotime($song['date'])), // Setze aktuelles Datum/Uhrzeit
            'duration' => $song['duration'] ?? null, // Dauer kann nicht immer vorhanden sein
            'title' => $title,
            'isPlayingNow' => $song['isPlayingNow'],
            'artist' => $artist_name,
            'spotifyTrackId' => $spotifyTrackId,
            'next_url' => null, // Hier könntest du eine URL setzen, falls erforderlich
            'genre' => $genres ?? null // Genre von Spotify
        ];
    } else {
        // Wenn kein Track gefunden wurde, fügen wir einen Eintrag ohne Genre hinzu
        $transformedData[] = [
            'date' => date('Y-m-d H:i:s', strtotime($song['date'])), // Setze aktuelles Datum/Uhrzeit
            'duration' => $song['duration'] ?? null,
            'title' => $title,
            'isPlayingNow' => $song['isPlayingNow'],
            'artist' => $artist_name,
            'spotifyTrackId' => null,
            'next_url' => null,
            'genre' =>  null // Kein Genre gefunden
        ];
    }
}
print_r($transformedData);
return $transformedData; // Gibt die transformierten Daten zurück

$genres = getGenresFromTrack($track, $access_token);


?>
