import createRoutineCreator from './createRoutineCreator';

export default function createCustomRoutine(typePrefix, stages, payloadCreator, metaCreator) {
  const customRoutineCreator = createRoutineCreator(stages);

  return customRoutineCreator(typePrefix, payloadCreator, metaCreator);
}
