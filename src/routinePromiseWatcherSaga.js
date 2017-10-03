import { takeEvery, take, race, put, call, all } from 'redux-saga/effects';
import { ROUTINE_PROMISE_ACTION } from './constants'

export function* handleRoutinePromiseAction(action) {
  const { values, props, routine, defer: { resolve, reject } } = action.payload;

  const [ {success, failure} ] = yield all([
    race({
      success: take(routine.SUCCESS),
      failure: take(routine.FAILURE),
    }),
    put(routine.trigger({ values, props })),
  ]);

  if (success) {
    yield call(resolve);
  } else {
    yield call(reject, (failure && failure.payload) || failure);
  }
}

export default function* routinePromiseWatcherSaga() {
  yield takeEvery(ROUTINE_PROMISE_ACTION, handleRoutinePromiseAction);
}
