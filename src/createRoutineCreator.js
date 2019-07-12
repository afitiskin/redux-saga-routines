import { createAction } from 'redux-actions';
import { getCreatorForType, toCamelCase, toUpperCase } from './utils';

export default function createRoutineCreator(stages, separator = '/'){
  let stagesArray = stages;

  if(!Array.isArray(stagesArray)){
    stagesArray = [].concat(stages)
  }

  if (!stages || stagesArray.length === 0) {
    throw new Error('Routine `stages` must not be empty');
  }

  const createRoutine = (typePrefix, payloadCreator, metaCreator) => {
    if(typeof typePrefix !== 'string'){
      throw new Error('Routine `typePrefix` must be a string');
    }

    const createActionCreator = (type) => createAction(`${typePrefix}${separator}${type}`, getCreatorForType(type, payloadCreator), getCreatorForType(type, metaCreator));

    const routine = stagesArray.reduce(
      (result, stage) => {
        const actionCreator = createActionCreator(stage);
        result[toCamelCase(stage)] = actionCreator;
        result[toUpperCase(stage)] = actionCreator.toString();
        return result;
      },
      createActionCreator(stagesArray[0])
    );
    routine._STAGES = stagesArray;
    routine._PREFIX = typePrefix;
    return routine;
  };

  createRoutine.STAGES = stagesArray;
  return createRoutine;
};
