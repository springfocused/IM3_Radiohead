# IM3_Radiohead

## Team:
- Suena Fischer
- Rabih Haj-Hassan

## Kurzbeschreibung unseres Projekts:
Unsere Website nutzt die SRF Radio- und Spotify-APIs, um detaillierte Einblicke in die aktuell gespielten Songs, Künstler
und Genres auf Radio SRF 1 zu bieten. Mit den gewonnenen Daten präsentieren wir den Nutzern
in Echtzeit, welche Musik am häufigsten gespielt wird. Zudem bietet die Seite eine Übersicht der Musiktrends, basierend auf den Häufigkeiten und Entwicklungen der gespielten Songs. Dank der grafischen Darstellungen können die Besucher nachvollziehen, welche Songs und Genres die Schweizer Radiolandschaft prägen.

## Learnings:
- Verwendung von PHP und ETL-Verfahren (Extract, Transform, Load)
- API-Integration (Radio SRF 1 und Spotify)
- Datenarchivierung und Abrufbarkeit
- Datenvisualisierung mit Balkendiagrammen
- Erweiterung des Wissens in HTML und CSS
- Fortgeschrittene Nutzung von JavaScript für dynamische Inhalte
- Erstellung eines skalierbaren Web-Tools

## Schwierigkeiten:
Während der Entwicklung unserer Webseite sind wir auf mehrere Herausforderungen gestossen. Eine der größten Schwierigkeiten bestand darin, mithilfe der Spotify-API die Genres der Songs und Künstler, die über die SRF 1 API geliefert wurden, korrekt zu identifizieren. Darüber hinaus stellte das gesamte PHP- und ETL-Verfahren (Extract, Transform, Load) eine komplexe Aufgabe dar, die eine sorgfältige Konfiguration und Implementierung erforderte. Gegen Schluss entschieden wir uns noch dazu den aktuellen Song auf der Startseite abspielbar zu machen. Dadurch entstand noch ein weiteres PHP-File. Diese Verbindung zwischen Backend und Frontend stellte sich als schwieriger dar, als gedacht. Ein weiterer Punkt war das responsive Design, um sicherzustellen, dass die Seite auf allen Geräten korrekt angezeigt wird. 

## Benutze Ressourcen:
- [ChatGPT](https://chat.openai.com)
- [W3Schools](https://www.w3schools.com)
- [Code-Along](https://github.com/Interaktive-Medien/DB-PHP)
- Coachings

## API "Bugs":
Auf unserer Startseite wird im Radio der aktuell spielende Song bei SRF1 angezeigt. Nicht ganz immer kann Spotify diesen finden und dann lässt er sich nicht abspielen. 
