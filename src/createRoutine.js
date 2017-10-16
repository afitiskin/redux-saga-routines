import stages from './routineStages';
import { PROMISE_ACTION } from './constants';

const identity = i => i;

export default function createRoutine(routineName = '', payloadCreator = identity, reduxFormFallback = true) {
  if (typeof routineName !== 'string') {
    throw new Error('Invalid routine name, it should be a string');
  }

  const routineParams = stages.reduce((result, stage) => {
    const stageActionType = `${routineName}_${stage}`;
    const stageActionCreator = (payload) => ({
      type: stageActionType,
      payload: payloadCreator(payload),
    });
    stageActionCreator.ACTION_TYPE = stageActionType;

    return Object.assign(result, {
      [stage]: stageActionType,
      [stage.toLowerCase()]: stageActionCreator,
    });
  }, {});

  const routine = (data, dispatch) => {
    return new Promise((resolve, reject) => dispatch({
      type: PROMISE_ACTION,
      payload: {
        data,
        params: routineParams,
        defer: { resolve, reject },
        reduxFormFallback,
      },
    }));
  };

  return Object.assign(routine, routineParams);
}
