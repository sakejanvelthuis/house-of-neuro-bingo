#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Sync localStorage data to JSON files (for backup/import compatibility)
const DATA_DIR = path.join(__dirname, '../src/data');

// This script should be run in browser console to export localStorage to files
console.log(`
Om data te synchroniseren, plak dit in je browser console:

// Export localStorage to JSON files
const students = JSON.parse(localStorage.getItem('nm_points_students_v3') || '[]');
const teachers = JSON.parse(localStorage.getItem('nm_points_teachers_v1') || '[]');
const awards = JSON.parse(localStorage.getItem('nm_points_awards_v2') || '[]');
const groups = JSON.parse(localStorage.getItem('nm_points_groups_v2') || '[]');

// Create data directory if needed
// (This would need to be done server-side)

// Save to files (server-side operation)
console.log('Studenten:', students.length);
console.log('Docenten:', teachers.length);
console.log('Awards:', awards.length);
console.log('Groepen:', groups.length);

console.log('Data is klaar voor export naar JSON bestanden');
`);