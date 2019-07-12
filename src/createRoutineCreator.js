import { createAction } from 'redux-actions';

const isFunction = value => typeof value === 'function';
const toCamelCase = value => value.toLowerCase().replace(/_+(\w)/g, (_, p1) => p1.toUpperCase());;

export default function createRoutineCreator(stages){
  if(stages === undefined){
    throw new Error('stages is undefined');
  }

  return function (typePrefix, payloadCreator, metaCreator) {
    if(typePrefix === undefined){
      throw new Error('typePrefix is undefined');
    }
    const getCreatorForType = (type, creator) => {
      if (!creator) {
        return creator;
      }
      if (isFunction(creator[type])) {
        return creator[type];
      }
      if (isFunction(creator[toCamelCase(type)])) {
        return creator[toCamelCase(type)];
      }
      if (isFunction(creator)) {
        return creator;
      }
      return undefined;
    };
    const createActionCreator = (type) => createAction(`${typePrefix}/${type}`, getCreatorForType(type, payloadCreator), getCreatorForType(type, metaCreator));
    const stagesArray = [].concat(stages);

    return stagesArray.reduce(
      (result, stage) => {
        const actionCreator = createActionCreator(stage);
        return Object.assign(result, {
          ...result,
          [toCamelCase(stage)]: actionCreator,
          [stage.toUpperCase()]: actionCreator.toString(),
        })
      },
      createActionCreator(stagesArray[0])
    );
  }
};
