# EC-Verwaltung-next

## Features

1. API mit automatischen\* routes.
2. API mit Framework unabhänigen Funktionen.
3. onInvalidate Hook
4. Vuetify mit Component Types und Treeshaking in dev + production!
5. Automatische Route detection mit vite-plugin-pages
6. Plugin inspection mit vite-plugin-inspect
7. Automatische mdi-icon importierung mit eigenem Plugin. (in .vue files!)

\*automatisch bezieht sich hier auf verwaltung und die mit einem Befehl erzeugbare .routes.ts für Deno

## Development

1. Bei änderungen an der Dateistrukut routes Ordner (api/routes) das `routes` script einmal ausführen.
2. In 1 Termianl `vite` starten.
3. In 1 Terminal ` deno run --no-check=remote --allow-net --import-map=./api/importmap.json api/mod.ts` starten. (evtl. denon nutzen).
4. Verwaltungsseite lebt in `http://localhost:3000/verwaltung/index.html`

## Caveats

In api/routes muss wenn getContext importiert wird immer noch ein `?ctx` angehängt werden damit die types in der Verwaltung hinhauen

## API in Verwaltung

Um eine API funktion in der Verwaltung zu importieren nutze den `@api/...` prefix. Dieser wird entsprechend von typescript aufgelöst um die richtigen typen zu haben aber genauso von vite abgefangen sodass die Datei nicht tatsächlich importiert wird.

## TODO (bevor es richtig losgehen kann)

### API

1. Auth - DONE
2. node scripte

#### Folgende Deno kompatible Packte / Bibliotheken

1. JWT - DONE
2. XLSX Templates - DONE
3. Mailer (gibt SMTP clients die tw. nicht alles können) ! - DONE muss noch in worker implementiert werden!
4. Gotenberg (ist simpel da schreiben wir was eigenes!) - DONE

##### Optional

1. web push

### Verwaltung

1. Auth - DONE
2. Lint
