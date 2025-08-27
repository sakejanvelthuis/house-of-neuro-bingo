# House of Neuro Bingo

Deze applicatie gebruikt een lijst met studenten uit `src/data/students.json` die wordt opgeslagen in `localStorage`.
Het opslagsleutel heeft een versienummer (bijv. `nm_points_students_v3`).
Verhoog dit nummer in `src/hooks/useStudents.js` wanneer je een nieuwe `students.json` importeert,
zodat bestaande installaties de nieuwe gegevens opnieuw laden.

## Nieuwe studentimport

Open de beheerderpagina en klik in **Studenten beheren** op **Importeer CSV-gegevens**. Kies het CSV-bestand met bingo-antwoorden; de gegevens worden samengevoegd met bestaande studenten zonder wachtwoorden of punten te verliezen.
