#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const DEFAULT_CSV = path.join(__dirname, '../data/responses.csv');
const csvPath = process.argv[2] || DEFAULT_CSV;

// Data storage paths
const DATA_DIR = path.join(__dirname, '../src/data');
const STUDENTS_FILE = path.join(DATA_DIR, 'students.json');

function parseCsv(content) {
  const records = [];
  let field = '';
  let record = [];
  let inQuotes = false;
  
  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      record.push(field);
      field = '';
    } else if (char === '\n' && !inQuotes) {
      record.push(field);
      records.push(record);
      record = [];
      field = '';
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

function main() {
  if (!fs.existsSync(csvPath)) {
    console.error(`CSV-bestand niet gevonden: ${csvPath}`);
    process.exit(1);
  }

  // Ensure data directory exists
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  // Read current students data (check both sources)
  let students = [];
  if (fs.existsSync(STUDENTS_FILE)) {
    try {
      students = JSON.parse(fs.readFileSync(STUDENTS_FILE, 'utf8'));
    } catch (e) {
      console.error('Fout bij lezen students.json:', e.message);
      process.exit(1);
    }
  }

  // Check for browser data in global variable (if available)
  if (typeof window !== 'undefined' && window.studentsData) {
    try {
      const browserStudents = window.studentsData;
      // Merge with existing students (browser data takes precedence for new accounts)
      const existingEmails = new Set(students.map(s => s.email.toLowerCase()));
      const newStudents = browserStudents.filter(s => !existingEmails.has(s.email.toLowerCase()));
      if (newStudents.length > 0) {
        students = [...students, ...newStudents];
        console.log(`Merged ${newStudents.length} students from browser data`);
      }
    } catch (e) {
      console.error('Fout bij samenvoegen browser data:', e.message);
    }
  }

  const content = fs.readFileSync(csvPath, 'utf8');
  const rows = parseCsv(content);
  
  if (!rows.length) {
    console.error('Geen data gevonden in CSV');
    process.exit(1);
  }

  const headers = rows[0];
  const dataRows = rows.slice(1).filter(r => r.length && r.some(cell => cell.trim().length));

  // Find column indices
  const emailIdx = headers.findIndex(h => /email/i.test(h));
  if (emailIdx === -1) {
    console.error('Geen email kolom gevonden in CSV');
    process.exit(1);
  }

  const qIdx = {};
  ['Q1', 'Q2', 'Q3', 'Q4'].forEach(q => {
    qIdx[q] = headers.findIndex(h => h === q);
    if (qIdx[q] === -1) {
      console.error(`Kolom ${q} niet gevonden in CSV`);
      process.exit(1);
    }
  });

  let success = 0;
  const unmatched = [];

  dataRows.forEach((cols) => {
    const email = (cols[emailIdx] || '').trim().toLowerCase();
    if (!email) return;

    const student = students.find((s) => s.email.toLowerCase() === email);
    if (!student) {
      unmatched.push(email);
      return;
    }

    // Update bingo answers
    student.bingo = {
      Q1: cols[qIdx.Q1].split(',').map(s => s.trim()),
      Q2: cols[qIdx.Q2].split(',').map(s => s.trim()),
      Q3: cols[qIdx.Q3].split(',').map(s => s.trim()),
      Q4: cols[qIdx.Q4].split(',').map(s => s.trim())
    };
    success++;
  });

  // Save updated students data
  fs.writeFileSync(STUDENTS_FILE, JSON.stringify(students, null, 2));

  console.log(`${success} studenten succesvol gekoppeld.`);
  
  if (unmatched.length) {
    console.log('\nNiet gevonden emails:');
    unmatched.forEach(email => console.log(`- ${email}`));
    console.log('\nZorg dat alle studenten eerst een account aanmaken.');
    process.exit(1);
  }
}

main();