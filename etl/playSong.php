<?php

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

// Get artist_name and song_name from URL parameters
$artist_name = isset($_GET['artist_name']) ? urldecode($_GET['artist_name']) : null;
$song_name = isset($_GET['song_name']) ? urldecode($_GET['song_name']) : null;

// Check if artist_name and song_name are provided
if ($artist_name && $song_name) {
    // Get access token
    $access_token = getSpotifyAccessToken($client_id, $client_secret);

    // Check if access token was successfully retrieved
    if ($access_token) {
        // Call the searchSong function with URL parameters
        $search_result = searchSong($song_name, $artist_name, $access_token);

        // Print search result
        echo json_encode($search_result);
    } else {
        echo 'Failed to retrieve access token.';
    }
} else {
    echo 'Please provide both artist_name and song_name in the URL parameters.';
}

?>
