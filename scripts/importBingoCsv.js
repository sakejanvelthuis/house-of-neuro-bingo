#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const DEFAULT_CSV = path.join(__dirname, '../data/responses.csv');
const csvPath = process.argv[2] || DEFAULT_CSV;

// Dit script koppelt antwoorden uit een CSV aan bestaande studentaccounts in
// `src/data/students.json`. Het JSON-bestand moet vooraf zijn gevuld met de
// accounts die studenten zelf hebben aangemaakt.

function parseCsv(content) {
  const records = [];
  let field = '';
  let record = [];
  let inQuotes = false;
  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    if (char === '"') {
      const next = content[i + 1];
      if (inQuotes && next === '"') {
        field += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      record.push(field);
      field = '';
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && content[i + 1] === '\n') i++;
      record.push(field);
      records.push(record);
      field = '';
      record = [];
    } else {
      field += char;
    }
  }
  if (field || record.length) {
    record.push(field);
    records.push(record);
  }
  return records;
}

function splitAnswers(str) {
  return str
    .split(/[;,\n]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function main() {
  if (!fs.existsSync(csvPath)) {
    console.error(`CSV-bestand niet gevonden: ${csvPath}`);
    process.exit(1);
  }
  const content = fs.readFileSync(csvPath, 'utf8');
  const rows = parseCsv(content);
  if (!rows.length) {
    console.error('CSV-bestand is leeg');
    process.exit(1);
  }
  const headers = rows[0];
  const dataRows = rows.slice(1).filter(r => r.length && r.some(cell => cell.trim().length));

  const emailIdx = headers.findIndex(h => /email/i.test(h));
  if (emailIdx === -1) {
    console.error('Geen e-mailkolom gevonden');
    process.exit(1);
  }

  const qIdx = {};
  ['Q1', 'Q2', 'Q3', 'Q4'].forEach(q => {
    const idx = headers.findIndex(h => h.startsWith(q));
    qIdx[q] = idx;
  });

  const studentsPath = path.join(__dirname, '../src/data/students.json');
  const students = JSON.parse(fs.readFileSync(studentsPath, 'utf8'));

  let success = 0;
  const unmatched = [];

  dataRows.forEach((cols) => {
    const email = (cols[emailIdx] || '').trim();
    if (!email) {
      console.error('Lege e-mail gevonden');
      return;
    }
    const student = students.find((s) => s.email.toLowerCase() === email.toLowerCase());
    if (!student) {
      console.error(`Geen account gevonden voor e-mail: ${email}`);
      unmatched.push(email);
      return;
    }

    const answers = {};
    for (const q of ['Q1', 'Q2', 'Q3', 'Q4']) {
      const idx = qIdx[q];
      const raw = idx >= 0 ? cols[idx] || '' : '';
      const arr = splitAnswers(raw).slice(0, 3);
      while (arr.length < 3) arr.push('');
      answers[q] = arr;
    }

    student.bingo = { ...student.bingo, ...answers };
    success++;
  });

  if (unmatched.length) {
    console.error(
      'Voor de bovenstaande e-mails is geen account gevonden. Zorg dat alle studenten eerst een account aanmaken.'
    );
    process.exit(1);
  }

  fs.writeFileSync(studentsPath, JSON.stringify(students, null, 2) + '\n');
  console.log(`${success} studenten succesvol gekoppeld.`);
}

main();
