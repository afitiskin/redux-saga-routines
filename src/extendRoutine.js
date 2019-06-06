import { createActionCreator } from './createRoutine';

export default function extendRoutine(routine, types = [], payloadCreator, metaCreator){
  const typePrefix = routine.getPrefix();
  return types.reduce(
    (result, stage) => {
      const actionCreator = createActionCreator({ type: stage, typePrefix, payloadCreator, metaCreator });
      return Object.assign(result, {
        [stage.toLowerCase()]: actionCreator,
        [stage.toUpperCase()]: actionCreator.toString(),
      });
    },
    routine
  );
}
