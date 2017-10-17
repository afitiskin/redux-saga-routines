import { ROUTINE_PROMISE_ACTION } from './constants';

export default function bindRoutineToReduxForm(routine) {
  return (values, dispatch, props) => new Promise((resolve, reject) => dispatch({
    type: ROUTINE_PROMISE_ACTION,
    payload: {
      values,
      props,
    },
    meta: {
      defer: { resolve, reject },
      reduxFormCompatible: true,
      routine,
    },
  }));
}
