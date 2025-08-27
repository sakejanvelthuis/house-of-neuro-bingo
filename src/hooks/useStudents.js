import usePersistentState from './usePersistentState';
import seedStudents from '../data/students.json';

// bump this key when the students.json seed data changes

const LS_KEY = 'nm_points_students_v2';


export default function useStudents() {
  return usePersistentState(LS_KEY, seedStudents);
}
