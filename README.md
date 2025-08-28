# House of Neuro Bingo

Deze applicatie gebruikt lijsten met studenten- en docentenaccounts uit
`src/data/students.json` en `src/data/teachers.json`. Standaard zijn deze
bestanden leeg: gebruikers maken zelf een account aan in de app en deze
gegevens worden lokaal opgeslagen in `localStorage`.

Bij het opstarten haalt de app de actuele lijsten op uit `/data/students.json`
en `/data/teachers.json` en vult hiermee `localStorage`. Wanneer de lijsten
wijzigen, sturen de hooks `useStudents` en `useTeachers` de complete arrays naar
de endpoints `/api/students` en `/api/teachers`. Het script
`scripts/dataApi.js` luistert op deze endpoints en overschrijft de bestanden
`src/data/students.json` en `src/data/teachers.json` met de ontvangen gegevens.
Tijdens ontwikkeling draait deze API standaard op `http://localhost:3001`; de
React devserver stuurt `/api`-aanroepen hierheen door. Voor een andere URL kan
`REACT_APP_API_BASE_URL` worden ingesteld.

Start de API tijdens ontwikkeling met:

```
node scripts/dataApi.js
```

Het script `scripts/importBingoCsv.js` leest een CSV-bestand met antwoorden voor
de bingokaart en koppelt deze aan bestaande studentaccounts op basis van het
e-mailadres. Elke e-mail in de CSV moet overeenkomen met een account in
`src/data/students.json`; ontbrekende accounts veroorzaken een foutmelding.

