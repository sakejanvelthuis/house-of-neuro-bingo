import React, { useState } from 'react';
import { questions, studentAnswers, studentIds } from './bingoData';

export default function Bingo() {
  const [activeStudent, setActiveStudent] = useState(studentIds[0]);
  const [matches, setMatches] = useState({ Q1: null, Q2: null, Q3: null, Q4: null });
  const [logged, setLogged] = useState({ row1: false, row2: false, col1: false, col2: false, diag1: false, diag2: false, full: false });

  const resetState = (studentId) => {
    setActiveStudent(studentId);
    setMatches({ Q1: null, Q2: null, Q3: null, Q4: null });
    setLogged({ row1: false, row2: false, col1: false, col2: false, diag1: false, diag2: false, full: false });
  };

  const checkPatterns = (m) => {
    const newLogged = { ...logged };
    if (m.Q1?.answer && m.Q2?.answer && !newLogged.row1) {
      console.log(`Bingo voor ${activeStudent}: horizontale rij (boven)`);
      newLogged.row1 = true;
    }
    if (m.Q3?.answer && m.Q4?.answer && !newLogged.row2) {
      console.log(`Bingo voor ${activeStudent}: horizontale rij (onder)`);
      newLogged.row2 = true;
    }
    if (m.Q1?.answer && m.Q3?.answer && !newLogged.col1) {
      console.log(`Bingo voor ${activeStudent}: verticale kolom (links)`);
      newLogged.col1 = true;
    }
    if (m.Q2?.answer && m.Q4?.answer && !newLogged.col2) {
      console.log(`Bingo voor ${activeStudent}: verticale kolom (rechts)`);
      newLogged.col2 = true;
    }
    if (m.Q1?.answer && m.Q4?.answer && !newLogged.diag1) {
      console.log(`Bingo voor ${activeStudent}: diagonaal`);
      newLogged.diag1 = true;
    }
    if (m.Q2?.answer && m.Q3?.answer && !newLogged.diag2) {
      console.log(`Bingo voor ${activeStudent}: diagonaal`);
      newLogged.diag2 = true;
    }
    if (m.Q1?.answer && m.Q2?.answer && m.Q3?.answer && m.Q4?.answer && !newLogged.full) {
      console.log(`Bingo voor ${activeStudent}: volledige kaart`);
      newLogged.full = true;
    }
    setLogged(newLogged);
  };

  const handleMatch = (q, otherId) => {
    if (!otherId) return;
    const my = studentAnswers[activeStudent][q];
    const other = studentAnswers[otherId][q];
    const match = my.find((a) => other.some((b) => b.toLowerCase() === a.toLowerCase()));
    const next = { ...matches, [q]: { otherId, answer: match || null } };
    setMatches(next);
    if (match) checkPatterns(next);
  };

  const hasHorizontal = logged.row1 || logged.row2;
  const hasVertical = logged.col1 || logged.col2;
  const hasDiagonal = logged.diag1 || logged.diag2;
  const hasFull = logged.full;

  return (
    <div className="p-4">
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <label className="mr-2">Kies je student:</label>
          <select
            value={activeStudent}
            onChange={(e) => resetState(e.target.value)}
            className="border p-1"
          >
            {studentIds.map((id) => (
              <option key={id} value={id}>
                {studentAnswers[id].name}
              </option>
            ))}
          </select>
        </div>
        <a href="#/student" className="px-4 py-2 border rounded self-start">Terug naar puntenoverzicht</a>
      </div>

      <div className="mb-4">
        <div>Horizontale bingo: {hasHorizontal ? 'ja' : 'nee'}</div>
        <div>Verticale bingo: {hasVertical ? 'ja' : 'nee'}</div>
        <div>Diagonale bingo: {hasDiagonal ? 'ja' : 'nee'}</div>
        <div>Volle kaart: {hasFull ? 'ja' : 'nee'}</div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {['Q1', 'Q2', 'Q3', 'Q4'].map((q) => {
          const cell = matches[q];
          const hasMatch = cell?.answer;
          return (
            <div key={q} className={`border p-4 rounded ${hasMatch ? 'bg-green-200' : ''}`}>
              {hasMatch ? (
                <div>
                  <div>🎉 Match met {cell.otherId} op: {cell.answer}</div>
                </div>
              ) : (
                <div>
                  <div className="font-semibold mb-1">{questions[q]}</div>
                  <ul className="list-disc ml-4 mb-2">
                    {studentAnswers[activeStudent][q].map((a) => (
                      <li key={a}>{a}</li>
                    ))}
                  </ul>
                  <select
                    defaultValue=""
                    onChange={(e) => handleMatch(q, e.target.value)}
                    className="border p-1"
                  >
                    <option value="" disabled>
                      Kies student
                    </option>
                    {studentIds
                      .filter((id) => id !== activeStudent)
                      .map((id) => (
                        <option key={id} value={id}>
                          {studentAnswers[id].name}
                        </option>
                      ))}
                  </select>
                  {cell && cell.answer === null && (
                    <div className="text-red-600 mt-2">
                      ❌ Geen overeenkomst gevonden. Probeer iemand anders!
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

