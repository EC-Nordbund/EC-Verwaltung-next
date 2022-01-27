# EC-Verwaltung-next

## Features
1. API mit automatischen* routes.
2. API mit Framework unabhänigen Funktionen.
3. Vuetify mit Component Types und Treeshaking in dev + production!
4. Automatische Route detection mit vite-plugin-pages
5. Plugin inspection mit vite-plugin-inspect
6. Automatische mdi-icon importierung mit eigenem Plugin. (in .vue files!)

*automatisch bezieht sich hier auf verwaltung und die mit einem Befehl erzeugbare .routes.ts für Deno

## Development
1. Bei änderungen an der Dateistrukut routes Ordner (api/routes) das `routes` script einmal ausführen.
2. In 1 Termianl `vite` starten.
3. In 1 Terminal `deno run --allow-net --import-map=./api/importmap.json api/mod.ts` starten. (evtl. denon nutzen).
4. Verwaltungsseite lebt in `http://localhost:3000/verwaltung/index.html`

## Caveats
In api/routes muss wenn getContext importiert wird immer noch ein `?ctx` angehängt werden damit die types in der Verwaltung hinhauen


## API in Verwaltung
Um eine API funktion in der Verwaltung zu importieren nutze den `@api/...` prefix. Dieser wird entsprechend von typescript aufgelöst um die richtigen typen zu haben aber genauso von vite abgefangen sodass die Datei nicht tatsächlich importiert wird.