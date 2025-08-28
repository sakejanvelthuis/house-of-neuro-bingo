import { useEffect, useCallback } from 'react';
import usePersistentState from './usePersistentState';

const LS_KEY = 'nm_points_teachers_v1';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

export default function useTeachers() {
  const [teachers, setTeachersBase] = usePersistentState(LS_KEY, []);

  useEffect(() => {
    let cancelled = false;
    fetch('/data/teachers.json')
      .then((r) => r.json())
      .then((seedTeachers) => {
        if (cancelled) return;
        setTeachersBase((curr) => (curr.length ? curr : seedTeachers));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [setTeachersBase]);

  const setTeachers = useCallback(
    (value) => {
      setTeachersBase((prev) => {
        const next = typeof value === 'function' ? value(prev) : value;
        fetch(`${API_BASE_URL}/api/teachers`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(next),
        }).catch(() => {});
        return next;
      });
    },
    [setTeachersBase]
  );

  return [teachers, setTeachers];
}
