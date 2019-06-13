import createRoutineCreator from './createRoutineCreator';

export default function createRoutine(prefix, payloadCreator, metaCreator) {
  const routine = createRoutineCreator({ prefix, payloadCreator, metaCreator });;
  routine.PREFIX = prefix;

  return routine;
}
