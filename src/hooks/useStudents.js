import { useEffect, useCallback } from 'react';
import usePersistentState from './usePersistentState';

const VERSION = 3;
const LS_KEY = `nm_points_students_v${VERSION}`;
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

export default function useStudents() {
  const [students, setStudentsBase] = usePersistentState(LS_KEY, []);

  // load students from JSON file and migrate any previous localStorage versions
  useEffect(() => {

    let cancelled = false;
    fetch('/data/students.json')
      .then((r) => r.json())
      .then((seedStudents) => {
        if (cancelled) return;
        setStudentsBase((curr) => {
          if (curr.length) return curr;
          try {
            let prevData = null;
            let prevKey = null;
            for (let i = 0; i < localStorage.length; i++) {
              const key = localStorage.key(i);
              if (key && key.startsWith('nm_points_students_v') && key !== LS_KEY) {
                const data = JSON.parse(localStorage.getItem(key) || 'null');
                if (Array.isArray(data)) {
                  prevData = data;
                  prevKey = key;
                  break;
                }
              }
            }
            if (prevData) {
              const merged = seedStudents.map((s) => {
                const old = prevData.find((p) => p.id === s.id);
                return old ? { ...s, ...old } : s;
              });
              if (prevKey) localStorage.removeItem(prevKey);
              return merged;
            }
            return seedStudents;
          } catch {
            return seedStudents;
          }
        });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };

  }, [setStudentsBase]);

  const setStudents = useCallback(
    (value) => {

      setStudentsBase((prev) => {
        const next = typeof value === 'function' ? value(prev) : value;
        fetch(`${API_BASE_URL}/api/students`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(next),
        }).catch(() => {});
        return next;
      });

    },
    [setStudentsBase]
  );

  return [students, setStudents];
}
