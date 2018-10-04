import { createAction } from 'redux-actions';
import routineStages from './routineStages';

const isFunction = value => typeof value === 'function';

export default function createRoutine(typePrefix, payloadCreator, metaCreator) {
  const getCreatorForType = (type, creator) => {
    if (!creator) {
      return creator;
    }
    if (isFunction(creator[type])) {
      return creator[type];
    }
    if (isFunction(creator[type.toLowerCase()])) {
      return creator[type.toLowerCase()];
    }
    if (isFunction(creator)) {
      return creator;
    }
    return undefined;
  };

  const createActionCreator = (type) => createAction(`${typePrefix}/${type}`, getCreatorForType(type, payloadCreator), getCreatorForType(type, metaCreator));

  return routineStages.reduce(
    (result, stage) => {
      const actionCreator = createActionCreator(stage);
      return Object.assign(result, {
        [stage.toLowerCase()]: actionCreator,
        [stage.toUpperCase()]: actionCreator.toString(),
      });
    },
    createActionCreator(routineStages[0])
  );
}
