import stages from './routineStages';

function bindRoutineCreator(routineCreator, dispatch) {
  return stages.reduce((result, stage) => {
    const key = stage.toLowerCase();

    return Object.assign(result, {
      [key]: (payload) => dispatch(routineCreator[key](payload)),
    });
  }, (payload) => routineCreator(payload, dispatch));
}

export default function bindRoutineCreators(routineCreators, dispatch) {
  if (typeof routineCreators === 'function') {
    return bindRoutineCreator(routineCreators, dispatch);
  }

  if (typeof routineCreators !== 'object' || routineCreators === null) {
    throw new Error(
      `bindRoutineCreators expected an object or a function, instead received ${bindRoutineCreators === null ? 'null' : typeof bindRoutineCreators}. Did you write "import routineCreators from" instead of "import * as routineCreators from"?`
    );
  }

  const keys = Object.keys(routineCreators);
  const boundRoutineCreators = {};
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    const routineCreator = routineCreators[key];
    if (typeof routineCreator === 'function') {
      boundRoutineCreators[key] = bindRoutineCreators(routineCreator, dispatch);
    }
  }
  return boundRoutineCreators;
}
