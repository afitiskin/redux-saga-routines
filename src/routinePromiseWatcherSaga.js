import { takeEvery, take, race, put, call, all } from 'redux-saga/effects';
import { ROUTINE_PROMISE_ACTION } from './constants'

const getPayload = (data) => (data && data.payload) || data;

export function* handleRoutinePromiseAction(action) {
  const {
    payload,
    meta: {
      routine,
      noSuccessPayload,
      defer: {
        resolve,
        reject,
      },
    },
  } = action;

  const [ {success, failure} ] = yield all([
    race({
      success: take(routine.SUCCESS),
      failure: take(routine.FAILURE),
    }),
    put(routine.trigger(payload)),
  ]);

  if (success) {
    yield noSuccessPayload ? call(resolve) : call(resolve, getPayload(success));
  } else {
    yield call(reject, getPayload(failure));
  }
}

export default function* routinePromiseWatcherSaga() {
  yield takeEvery(ROUTINE_PROMISE_ACTION, handleRoutinePromiseAction);
}
