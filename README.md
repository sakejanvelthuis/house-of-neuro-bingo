# House of Neuro Bingo

Deze applicatie gebruikt een lijst met studenten uit `src/data/students.json` die wordt opgeslagen in `localStorage`.

## Nieuwe studentimport

Wanneer `students.json` wordt bijgewerkt (bijvoorbeeld na een nieuwe CSV-import), verhoog dan het versienummer in `src/hooks/useStudents.js`. Het huidige versienummer is `nm_points_students_v2`; pas dit bijvoorbeeld aan naar `nm_points_students_v3` bij een volgende import.

Een wijziging van dit versienummer zorgt ervoor dat `usePersistentState` de lokale opslag opnieuw seedt zodat de nieuwe studenten zichtbaar worden voor bestaande installaties.
