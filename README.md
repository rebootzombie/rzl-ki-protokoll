# RZL KI Kontroll Zentrum

Öffentliches, manuell gepflegtes KI-Forschungsprotokoll. Die Firmenwebsite bleibt bei Webador Lite. Keine automatische KI-Kommunikation, keine Schlüssel und kein kostenpflichtiger Dienst.

`protokoll.json` ist die feste maschinenlesbare Quelle. `index.html` zeigt deren veröffentlichten Inhalt. `editor.html` verwendet den bestehenden lokalen RZL-Prototyp und speichert Entwürfe ausschließlich im Browser. Veröffentlichungen erfolgen durch authentifizierte GitHub-Commits.

## Manuelle Aktualisierung

1. Den lokalen Editor öffnen. Auf einem neuen Gerät zuerst die aktuelle `protokoll.json` herunterladen und im leeren Editor importieren. Bei demselben Gerät den bestehenden Entwurf weiterverwenden. Ein aktueller öffentlicher Stand darf nicht durch einen älteren Entwurf überschrieben werden.
2. Nachricht, Entscheidung oder Forschungsstand vollständig einfügen und lokal speichern. Vollständiges Protokoll exportieren.
3. Dieses Repository herunterladen oder klonen. Im Repository-Ordner `node aktualisieren.cjs PFAD/ZUM/EXPORT/protokoll.json` ausführen. Voraussetzung ist Node.js. Der Befehl arbeitet nur lokal und kommuniziert mit keiner KI.
4. Der Befehl prüft die Version und stellt sicher, dass alle alten Einträge, Sitzungen und Änderungen unverändert erhalten bleiben. Er erzeugt das aktuelle JSON, einen neuen Versionsstand sowie die zusätzlichen Ansichten.
5. Die geänderten Dateien gemeinsam mit einer Nachricht wie `Protokoll 003: Grok-Beitrag ergänzt` über Git committen und pushen. Alternativ Dateien über die GitHub-Weboberfläche hochladen und dort committen. Für Unterordner die Verzeichnisstruktur erhalten; ein ZIP-Upload wird von GitHub nicht automatisch entpackt.
6. Das Pages-Deployment abwarten. Dieselbe öffentliche `protokoll.json` abrufen und `protocol_version` sowie den vollständigen neuen Inhalt prüfen. Cache- und Deployment-Verzögerungen sind möglich. Eine erfolgreiche Speicherung im Editor ist noch keine Veröffentlichung.

Alle Änderungen sind in Git versioniert. Dateien unter `versionen/` werden vom Hilfsprogramm nicht überschrieben. Administratoren könnten Git-Historie oder Dateien technisch verändern; dies ist kein manipulationssicheres Archiv. GitHub-Anmeldung schützt das Veröffentlichen, nicht den lokalen Entwurf. Keine Tokens in den Editor oder ins Repository eintragen.

## JSON-Ansichten

- `protokoll.json`: vollständiger Stand mit allen Einträgen, Sitzungen und Änderungen.
- `stand.json`: letzter explizit dokumentierter Forschungsstand, sonst `null`.
- `nachrichten.json`: letzte 20 Nachrichten.
- `entscheidungen.json`: dokumentierte Entscheidungen.
- `sitzungen.json` und `sitzungen/S0001.json`: Sitzungsverzeichnis und einzelne Sitzungen.
- `aenderungen.json`: Änderungsverzeichnis mit Links zu `aenderungen/seit-001.json` usw.
- `versionen/protokoll-001.json` usw.: unveränderte veröffentlichte Versionsstände.

`revision` ist numerisch, `protocol_version` stellt sie mit mindestens drei Ziffern dar. Die Formatversion `schema_version` ist davon unabhängig. Änderungen seit einer Version schließen diese Ausgangsversion aus und reichen bis zum aktuell veröffentlichten Stand. Die Dateien werden bei jeder manuellen Veröffentlichung aktualisiert. Beliebige Query-Parameter erzeugen auf dem statischen Hosting keine dynamischen Antworten.

## Hosting

GitHub Pages: öffentliches Repository, Veröffentlichung von `main` aus dem Wurzelordner `/`, ohne Build-Schritt. `.nojekyll` kennzeichnet statische Dateien.

Cloudflare Pages ist eine Alternative: dieselben Dateien lassen sich per Git-Integration oder Direct Upload bereitstellen. `_headers` enthält dort Regeln für JSON und erneute Cache-Prüfung. GitHub Pages wertet diese Datei nicht aus. Noch kein Cloudflare-Projekt eingerichtet. Ein kostenloser Tarif ist nur innerhalb seiner jeweiligen Grenzen kostenlos; keine kostenpflichtigen Optionen aktivieren.

Offizielle Dokumentation:
- https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages
- https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits
- https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
- https://developers.cloudflare.com/pages/get-started/direct-upload/
- https://developers.cloudflare.com/pages/platform/limits/

Die ersten beiden Beiträge sind ausdrücklich technische Veröffentlichungstests. Sie ersetzen keinen echten, vom Nutzer eingefügten Grok-Forschungsbeitrag.
