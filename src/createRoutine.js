import routineStages from './routineStages';
import createRoutineCreator from './createRoutineCreator';

export default function createRoutine(typePrefix, payloadCreator, metaCreator) {
  const defaultRoutineCreator = createRoutineCreator(routineStages);

  return defaultRoutineCreator(typePrefix, payloadCreator, metaCreator);
}
