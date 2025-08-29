import { useState, useEffect } from 'react';

export default function useStudents() {
  const [students, setStudentsState] = useState([]);

  useEffect(() => {
    // First check localStorage
    const stored = localStorage.getItem('nm_points_students_v3');
    if (stored) {
      try {
        const localStudents = JSON.parse(stored);
        if (localStudents.length > 0) {
          setStudentsState(localStudents);
          window.studentsData = localStudents;
          return;
        }
      } catch (e) {
        console.error('Error parsing students from localStorage:', e);
      }
    }

    // If no localStorage data, load from JSON file
    fetch('/data/students.json')
      .then(response => response.json())
      .then(jsonStudents => {
        console.log('Loaded students from JSON:', jsonStudents.length);
        
        // Filter verwijderde studenten
        const deletedStudents = JSON.parse(localStorage.getItem('nm_deleted_students') || '[]');
        const filteredStudents = jsonStudents.filter(s => !deletedStudents.includes(s.id));
        
        setStudentsState(filteredStudents);
        localStorage.setItem('nm_points_students_v3', JSON.stringify(filteredStudents));
        window.studentsData = filteredStudents;
      })
      .catch(error => {
        console.error('Error loading students from JSON:', error);
      });
  }, []);

  const setStudents = (updater) => {
    const newStudents = typeof updater === 'function' ? updater(students) : updater;
    setStudentsState(newStudents);
    localStorage.setItem('nm_points_students_v3', JSON.stringify(newStudents));
    window.studentsData = newStudents;
    const baseUrl = process.env.REACT_APP_API_BASE_URL || '';
    try {
      fetch(`${baseUrl}/api/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStudents)
      }).catch(err => {
        console.error('Failed to sync students:', err);
      });
    } catch (e) {
      console.error('Failed to sync students:', e);
    }
  };

  return [students, setStudents];
}
