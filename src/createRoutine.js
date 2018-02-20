import { createAction } from 'redux-actions';
import routineStages from './routineStages';

export default function createRoutine(typePrefix, ...params) {
  const createActionCreator = (type) => createAction(`${typePrefix}/${type}`, ...params);

  const action = routineStages.reduce(
    (result, stage) => {
      const actionCreator = createActionCreator(stage);
      return Object.assign(result, {
        [stage.toLowerCase()]: actionCreator,
        [stage.toUpperCase()]: actionCreator.toString(),
      });
    },
    createActionCreator(routineStages[0])
  );

  // allow to use this action in recursive structure in `handleActions`
  action.toString = () => typePrefix;

  return action;
}
