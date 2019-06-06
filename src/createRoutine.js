import { createAction } from 'redux-actions';
import routineStages from './routineStages';

const isFunction = value => typeof value === 'function';

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

export const createActionCreator = ({ type, typePrefix, payloadCreator, metaCreator }) => createAction(`${typePrefix}/${type}`, getCreatorForType(type, payloadCreator), getCreatorForType(type, metaCreator));

export default function createRoutine(typePrefix, payloadCreator, metaCreator) {
  const routine = routineStages.reduce(
    (result, stage) => {
      const actionCreator = createActionCreator({type: stage, typePrefix, payloadCreator, metaCreator});
      return Object.assign(result, {
        [stage.toLowerCase()]: actionCreator,
        [stage.toUpperCase()]: actionCreator.toString(),
      });
    },
    createActionCreator({ type: routineStages[0], typePrefix, payloadCreator, metaCreator })
  );

  routine.getPrefix = () => typePrefix;

  return routine;
}
