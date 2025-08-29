import { useState, useEffect } from 'react';

export default function useTeachers() {
  const [teachers, setTeachersState] = useState([]);

  useEffect(() => {
    // First check localStorage
    const stored = localStorage.getItem('nm_points_teachers_v3');
    if (stored) {
      try {
        const localTeachers = JSON.parse(stored);
        if (localTeachers.length > 0) {
          setTeachersState(localTeachers);
          return;
        }
      } catch (e) {
        console.error('Error parsing teachers from localStorage:', e);
      }
    }

    // If no localStorage data, load from JSON file
    fetch('/data/teachers.json')  // Changed from /src/data/teachers.json
      .then(response => response.json())
      .then(jsonTeachers => {
        console.log('Loaded teachers from JSON:', jsonTeachers.length);
        setTeachersState(jsonTeachers);
        localStorage.setItem('nm_points_teachers_v3', JSON.stringify(jsonTeachers));
      })
      .catch(error => {
        console.error('Error loading teachers from JSON:', error);
      });
  }, []);

  const setTeachers = (updater) => {
    const newTeachers = typeof updater === 'function' ? updater(teachers) : updater;
    setTeachersState(newTeachers);
    localStorage.setItem('nm_points_teachers_v3', JSON.stringify(newTeachers));
  };

  return [teachers, setTeachers];
}
