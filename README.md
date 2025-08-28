# House of Neuro Bingo

Deze applicatie gebruikt een lijst met studentenaccounts uit `src/data/students.json`.
Standaard is dit bestand leeg: studenten maken zelf een account aan in de app en
deze gegevens worden lokaal opgeslagen in `localStorage`.

Bij het opstarten haalt de app de actuele studentenlijst op uit `/data/students.json`
en vult hiermee `localStorage`. Wanneer de lijst met studenten wijzigt, stuurt de
hook `useStudents` de complete array naar de endpoint `/api/students`. Het script
`scripts/studentsApi.js` luistert op deze endpoint en overschrijft `src/data/students.json`
met de ontvangen gegevens. Tijdens ontwikkeling draait deze API standaard op
`http://localhost:3001`; de React devserver stuurt `/api`-aanroepen hierheen door.
Voor een andere URL kan `REACT_APP_API_BASE_URL` worden ingesteld.

Start de API tijdens ontwikkeling met:

```
node scripts/studentsApi.js
```

Het script `scripts/importBingoCsv.js` leest een CSV-bestand met antwoorden voor
de bingokaart en koppelt deze aan bestaande studentaccounts op basis van het
e-mailadres. Elke e-mail in de CSV moet overeenkomen met een account in
`src/data/students.json`; ontbrekende accounts veroorzaken een foutmelding.

