import createRoutineCreator from './createRoutineCreator';

export default function extendRoutine(routine, extend = [], payloadCreator, metaCreator) {
  const stages = typeof stages === 'string' ? [extend] : extend;

  return createRoutineCreator({ routine, stages, payloadCreator, metaCreator });
}
