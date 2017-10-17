import { ROUTINE_PROMISE_ACTION } from './constants';

export default function promisifyRoutine(routine) {
  return (payload, dispatch) => new Promise((resolve, reject) => dispatch({
    type: ROUTINE_PROMISE_ACTION,
    payload,
    meta: {
      defer: { resolve, reject },
      routine,
    },
  }));
}
