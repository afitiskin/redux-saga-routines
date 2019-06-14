import routineStages from './routineStages';
import createRoutineCreator from './createRoutineCreator';

export default function createExtendedRoutine(typePrefix, stages, payloadCreator, metaCreator) {
  const extendedStages = [...routineStages, ...[].concat(stages)];
  const extendedRoutineCreator = createRoutineCreator(extendedStages);

  return extendedRoutineCreator(typePrefix, payloadCreator, metaCreator);
}
