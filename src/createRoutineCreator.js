import { createAction } from 'redux-actions';
import routineStages from './routineStages';

const isFunction = value => typeof value === 'function';
const toCamelCase = string => string.toLowerCase().replace(/[_.\- ]+(\w|$)/g, (_, p1) => p1.toUpperCase());

export default function createRoutineCreator({
  prefix,
  stages = routineStages,
  payloadCreator,
  metaCreator,
  routine,
}) {
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
  let typePrefix = prefix;
  if(routine){
    typePrefix = routine.PREFIX;
  }

  const createActionCreator = (type) => createAction(`${typePrefix}/${type}`, getCreatorForType(type, payloadCreator), getCreatorForType(type, metaCreator));
  const [ TRIGGER ] = routineStages;

  const result = stages.reduce(
    (result, stage) => {
      const actionCreator = createActionCreator(stage);
      return Object.assign(result, {
        [toCamelCase(stage)]: actionCreator,
        [stage.toUpperCase()]: actionCreator.toString(),
      });
    },
    routine ? routine : createActionCreator(TRIGGER)
  );

  return result
}
