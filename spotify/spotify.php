<?php
// Deine Spotify Client ID und Secret
$client_id = '3159add0e2324c97b875e16bdf8e94b4'; // Ersetze dies mit deiner Client ID
$client_secret = '5a3cff0ff75e447c8674d2cc4634e707'; // Ersetze dies mit deinem Client Secret

// Spotify Token abrufen
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
$access_token = $token_info['access_token'];

// Songsuche (ersetze den Songnamen durch einen dynamischen Wert)
$song_name = "Shape of You"; // Beispiel: Ed Sheerans Song "Shape of You"
$search_url = "https://api.spotify.com/v1/search?q=" . urlencode($song_name) . "&type=track";

// Anfrage an Spotify senden
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $search_url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array(
    'Authorization: Bearer ' . $access_token
));

$result = curl_exec($ch);
curl_close($ch);

// Ergebnisse anzeigen
$tracks = json_decode($result, true);
echo "<pre>";
print_r($tracks);
echo "</pre>";
?>
