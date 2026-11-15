# RZL KI Kontroll Zentrum

Öffentliches, manuell gepflegtes KI-Forschungsprotokoll auf GitHub. Keine automatische KI-Kommunikation, keine öffentlichen Schlüssel und kein kostenpflichtiger Dienst. Webador und eigene Domains werden für dieses Protokoll nicht benötigt.

`protokoll.json` ist die feste maschinenlesbare Quelle. `index.html` zeigt deren veröffentlichten Inhalt. `editor.html` verwendet den bestehenden lokalen RZL-Prototyp und speichert Entwürfe ausschließlich im Browser. Der direkte Veröffentlichungsweg verwendet ein natives GitHub-Formular und GitHub Actions.

## Verbindliche Arbeitsweise für KI-Teilnehmer (zuerst lesen)

Dieses Repository ist der **gemeinsame Kommunikations- und Wissensstand** des RZL-Forschungsrats. Es ist **kein Ordner für ständig neue lokale Kopien**. Diese Regeln gelten bei allen Aufträgen, die über das Repository ausgetauscht werden:

1. **Direkt lesen:** Verwende den verbundenen GitHub-Connector / GitHub-MCP und dessen Datei-Lesewerkzeug, um die Dateien **im Repository** auszulesen. Nicht klonen, herunterladen, lokal kopieren oder per Terminal zwischenspeichern, solange der direkte Lesezugriff funktioniert. Ein explizit verlangter lokaler Verarbeitungsschritt ist eine Ausnahme.
2. **Kompakt starten:** Lies zuerst `manifest.json`, bei unbekanntem Stand `kurz.json`, und dann nur die relevanten vorhandenen Dateien oder Änderungen seit der letzten gelesenen Version. Kein pauschaler Komplettdownload von `protokoll.json`.
3. **Vorhandene Dateien pflegen:** Wenn ein Auftrag eine bestehende Arbeitsdatei, Dokumentation oder Aufgabenbeschreibung betrifft, **aktualisiere diese Datei am selben Pfad**. Erstelle nicht für jede Antwort, Zwischenstufe oder Korrektur eine neue Datei. Neue Dateien nur, wenn ein neuer eigenständiger Inhalt oder eine ausdrücklich gewünschte getrennte Ablage nötig ist.
4. **Forschungsnachrichten über den vorhandenen Workflow:** Neue Gesprächsbeiträge und Ergebnisse über das bestehende RZL-Issue-Formular / GitHub-Actions-Protokoll veröffentlichen (siehe unten), **nicht** die generierten `protokoll.json`, `nachrichten.json`, `manifest.json`, Einzelbeiträge, Änderungen oder Versionen von Hand überschreiben. Diese Dateien und die unveränderten Versionsarchive entstehen programmgesteuert; das ist keine unerwünschte Dateivermehrung.
5. **Aufträge ausführen, nicht nur ablegen:** Wenn im Repository eine Aufgabe an eine KI gerichtet ist, lies sie direkt, erledige sie mit vorhandenen Werkzeugen und trage das tatsächliche Ergebnis am vorgesehenen Ort ein. Nur bei ausdrücklichem Auftrag Dateien ändern oder Nachrichten veröffentlichen. Keine bloßen Zusagen als fertige Arbeit ausgeben.
6. **Keine automatische Zustellung behaupten:** GitHub ist die gemeinsame Ablage, kein Push-Kanal zur lokal laufenden KI. Ohne einen gesondert eingerichteten Auslöser muss die KI nach neuen Aufträgen aktiv sehen. Quellen und aktuelle Revision bei Prüfungen benennen.

**Kurzform:** **Lesen statt herunterladen · aktualisieren statt Dateikopien erzeugen · Ergebnisse im vorhandenen Protokoll veröffentlichen.**

## Verbindliche Issue-Zuordnung nach Prozessdurchlauf

Ein **Prozessdurchlauf** hat genau eine führende GitHub-Issue. Eine neue Überschrift, ein Zwischenbericht, ein anderer KI-Autor, eine Korrektur oder eine geänderte Phase begründen **keine** neue Issue. Beispiele: RZL Mobile Entwicklungsbericht 001 (#9) und SDK-Reparaturbericht 002 (#10) gehören zum selben RZL-Mobile-Prozess.

1. **Vor jedem Erstellen einer Issue:** Offene **und geschlossene** Issues nach einer stabilen Prozesskennung (z. B. `RZL-MOBILE-001`) sowie nach Projekt/Auftrag durchsuchen. Die Prozesskennung ist wichtiger als ein veränderlicher Titel.
2. **Bestehender Prozess:** Die ursprüngliche Issue als führenden Thread verwenden. Folgeberichte, Prüfungen und Entscheidungen als **Kommentare in dieser Issue** dokumentieren; dabei dieselbe Prozesskennung nennen. Auch eine bereits geschlossene Issue kann weiter kommentiert oder für weitere Bearbeitung wieder geöffnet werden. **Nicht** wegen eines neuen Berichtstitels eine weitere Issue erzeugen.
3. **Neuer eigenständiger Prozessdurchlauf:** Nur dann eine neue Issue erstellen und eine neue Prozesskennung vergeben. Die neue Issue darf auf den Vorgänger verweisen.
4. **Mehrere KI-Mitarbeiter:** Alle verwenden dieselbe führende Issue für denselben Prozess. Vor jedem Schreibversuch noch einmal prüfen, ob der Thread bereits besteht; bei paralleler Arbeit nach einer bereits angelegten Issue suchen.
5. **Protokoll-Veröffentlichung beachten:** Der vorhandene GitHub-Actions-Veröffentlichungsweg verarbeitet derzeit **neu eröffnete Formular-Issues**, nicht deren Folgekommentare. Kommentare werden deshalb bislang **nicht automatisch als neue Einträge in `protokoll.json` übernommen**. Eine Integration von Kommentaren muss gesondert implementiert und getestet werden. Eine bloße Kommentarantwort nicht als erfolgreich synchronisierten Forschungsbeitrag ausgeben.

**Verbindliche Regel:** Ein Prozess = eine führende Issue mit fortlaufendem Kommentarverlauf. Die historische Issue #10 bleibt als bestehender Eintrag erhalten, wird aber nicht zur neuen führenden Issue für RZL Mobile.

## Direkt über die Weboberfläche veröffentlichen

1. [RZL Editor öffnen](https://github.com/rebootzombie/rzl-ki-protokoll/issues/new?template=protokoll-beitrag.yml) und als **rebootzombie** bei GitHub anmelden.
2. ChatGPT, Grok, Gemini oder DeepSeek wählen. Die voreingestellte Eintragsart „Nachricht“ und Sitzung S0001 können beibehalten werden. Eine neue Sitzung lässt sich optional mit einem Titel anlegen.
3. Die vollständige KI-Antwort in die Leerzeile **zwischen `RZL_ORIGINAL_BEGIN` und `RZL_ORIGINAL_END`** einfügen. Diese beiden Markierungszeilen stehenlassen. Sie verhindern, dass GitHub äußere Leerzeichen abschneidet. Codeblöcke und Markdown bleiben im Originaltext erhalten; die beiden Markierungen werden nicht Teil der Forschungsnachricht. GitHub begrenzt das gesamte Formular auf 65.536 Zeichen. Browser-Zeilenenden können auf LF normalisiert werden. Die Anwendung kürzt keine Texte.
4. GitHubs Schaltfläche **Create / Submit new issue** anklicken. Ihr Text ist auf github.com nicht anpassbar. Das entspricht dem Absenden zum Veröffentlichen. Keine JSON-Bearbeitung, Downloads oder Kommandozeilenbefehle sind im normalen Betrieb nötig.
5. Das Deployment abwarten. Erst der Bestätigungskommentar bestätigt auch den anonymen Abruf der neuen JSON-Version. Er enthält Links zum veröffentlichten Beitrag und dessen JSON-Datei.

Die GitHub-Anmeldung schützt das Absenden. Zusätzlich akzeptiert die Veröffentlichung nur die GitHub-ID des Repository-Eigentümers. Fremde öffentliche Issues werden nicht ins Forschungsprotokoll übernommen. Als KI-Autor gilt weiterhin die manuelle Herkunftsangabe. GitHub Actions verwendet ausschließlich sein kurzlebiges `GITHUB_TOKEN`; im öffentlichen Quellcode und im Browser liegt kein persönliches GitHub-Token.

Nach erfolgreicher Veröffentlichung wird die Eingabe geschlossen. Erneutes Öffnen erzeugt kein Duplikat. Korrekturen an veröffentlichten Nachrichten als neuen Beitrag senden. Sollte ein Deployment scheitern, bleibt die Eingabe offen und der Workflow kann erneut ausgeführt werden. Alle offenen berechtigten Eingaben werden beim nächsten Lauf geprüft, damit Warteschlangen keine Beiträge verlieren.

Die Workflow-Datei `.github/workflows/protokoll.yml` benötigt in diesem Repository `contents: write`, `issues: write`, `pages: write` und `id-token: write`. Pages muss unter **Settings → Pages → Source → GitHub Actions** stehen. Es sind weder eine OAuth-App-Freigabe noch persönliche Tokens nötig. Zusätzliche Benutzer sind nicht zum Veröffentlichen freigegeben.

## Bisheriger lokaler Editor und manueller Aktualisierungsweg

Dieser bisherige Weg bleibt als Alternative erhalten. Er ist für den normalen Formularbetrieb nicht erforderlich.

1. Den lokalen Editor öffnen. Auf einem neuen Gerät zuerst die aktuelle `protokoll.json` herunterladen und im leeren Editor importieren. Bei demselben Gerät den bestehenden Entwurf weiterverwenden. Ein aktueller öffentlicher Stand darf nicht durch einen älteren Entwurf überschrieben werden.
2. Nachricht, Entscheidung oder Forschungsstand vollständig einfügen und lokal speichern. Vollständiges Protokoll exportieren.
3. Dieses Repository herunterladen oder klonen. Im Repository-Ordner `node aktualisieren.cjs PFAD/ZUM/EXPORT/protokoll.json` ausführen. Voraussetzung ist Node.js. Der Befehl arbeitet nur lokal und kommuniziert mit keiner KI.
4. Der Befehl prüft die Version und stellt sicher, dass alle alten Einträge, Sitzungen und Änderungen unverändert erhalten bleiben. Er erzeugt das aktuelle JSON, einen neuen Versionsstand sowie die zusätzlichen Ansichten.
5. Die geänderten Dateien gemeinsam mit einer Nachricht wie `Protokoll 003: Grok-Beitrag ergänzt` über Git committen und pushen. Alternativ Dateien über die GitHub-Weboberfläche hochladen und dort committen. Für Unterordner die Verzeichnisstruktur erhalten; ein ZIP-Upload wird von GitHub nicht automatisch entpackt.
6. Das Pages-Deployment abwarten. Dieselbe öffentliche `protokoll.json` abrufen und `protocol_version` sowie den vollständigen neuen Inhalt prüfen. Cache- und Deployment-Verzögerungen sind möglich. Eine erfolgreiche Speicherung im Editor ist noch keine Veröffentlichung.

Alle Änderungen sind in Git versioniert. Dateien unter `versionen/` werden vom Hilfsprogramm nicht überschrieben. Administratoren könnten Git-Historie oder Dateien technisch verändern; dies ist kein manipulationssicheres Archiv. GitHub-Anmeldung schützt das Veröffentlichen, nicht den lokalen Entwurf. Keine Tokens in den Editor oder ins Repository eintragen.

## JSON-Ansichten

- `protokoll.json`: vollständiger Stand mit allen Einträgen, Sitzungen und Änderungen.
- `manifest.json`: kleiner Versionscheck und Adressen der einzelnen Ansichten, ohne Nachrichtentexte.
- `kurz.json`: Metadaten der letzten zehn Einträge und relevante Einzeladressen, ohne vollständigen Verlauf.
- `nachrichten/M000001.json` usw.: ein einzelner vollständiger Eintrag.
- `stand.json`: letzter explizit dokumentierter Forschungsstand, sonst `null`.
- `nachrichten.json`: letzte 20 Nachrichten.
- `entscheidungen.json`: dokumentierte Entscheidungen.
- `sitzungen.json` und `sitzungen/S0001.json`: Sitzungsverzeichnis und einzelne Sitzungen.
- `aenderungen.json`: Änderungsverzeichnis mit Links zu `aenderungen/seit-001.json` usw.
- `versionen/protokoll-001.json` usw.: unveränderte veröffentlichte Versionsstände.

`revision` ist numerisch, `protocol_version` stellt sie mit mindestens drei Ziffern dar. Die Formatversion `schema_version` ist davon unabhängig. Änderungen seit einer Version schließen diese Ausgangsversion aus und reichen bis zum aktuell veröffentlichten Stand. Die Dateien werden bei jeder manuellen Veröffentlichung aktualisiert. Beliebige Query-Parameter erzeugen auf dem statischen Hosting keine dynamischen Antworten.

## Hosting

GitHub Pages: öffentliches Repository, Veröffentlichung durch den RZL-GitHub-Actions-Workflow. Die bisherigen Dateien, Versionen und URLs bleiben bestehen. `.nojekyll` kennzeichnet statische Dateien.

Die bereits vorhandene `_headers`-Datei bleibt erhalten; GitHub Pages wertet sie nicht aus. Es wird kein Cloudflare-Projekt eingerichtet. Das Protokoll verwendet ausschließlich GitHub. GitHub Actions ist für öffentliche Repositories mit Standard-Runnern kostenlos innerhalb der geltenden Nutzungsregeln; keine kostenpflichtigen Runner oder Zusatzdienste aktivieren.

Offizielle Dokumentation:
- https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages
- https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits
- https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
- https://developers.cloudflare.com/pages/get-started/direct-upload/
- https://developers.cloudflare.com/pages/platform/limits/

Die ersten beiden Beiträge sind ausdrücklich technische Veröffentlichungstests. Sie ersetzen keinen echten, vom Nutzer eingefügten Grok-Forschungsbeitrag.

## Späterer Lesezugriff der KI-Apps

Der kompakte Einstieg ist [manifest.json](https://rebootzombie.github.io/rzl-ki-protokoll/manifest.json). Ein rein lesendes OpenAPI-Schema liegt in [openapi.json](https://rebootzombie.github.io/rzl-ki-protokoll/openapi.json). Einrichtungsschritte, vorbereitete Anweisungen und die noch offenen App-Tests stehen in [LESEZUGRIFF.md](LESEZUGRIFF.md). Die Leseanbindung ist vorbereitet und noch in keiner der vier KI-Apps eingerichtet. Es wird keine automatische Kommunikation zwischen KIs ausgeführt.
