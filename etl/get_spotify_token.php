<?php
// Spotify API Credentials
$client_id = '3159add0e2324c97b875e16bdf8e94b4'; // Deine client_id
$client_secret = '5a3cff0ff75e447c8674d2cc4634e707'; // Dein client_secret

// URL für den Access Token
$token_url = 'https://accounts.spotify.com/api/token';

// Setze die Kopfzeilen für den HTTP-Request
$headers = [
    'Authorization: Basic ' . base64_encode($client_id . ':' . $client_secret),
];

// Post-Daten für den Request
$post_data = [
    'grant_type' => 'client_credentials'
];

// Initialisiere cURL
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $token_url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($post_data));
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

// Führe den Request aus und hole die Antwort
$response = curl_exec($ch);
curl_close($ch);

// Überprüfen, ob ein Fehler aufgetreten ist
if ($response === false) {
    die('Error fetching the access token.');
}

// Parsen der Antwort
$response_data = json_decode($response, true);

// Zugriff auf das Access Token
$access_token = $response_data['access_token'];

// Access Token als JSON zurückgeben
header('Content-Type: application/json');
echo json_encode(['access_token' => $access_token]);
?>
