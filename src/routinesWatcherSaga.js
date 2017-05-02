import { takeEvery, take, race, put, call } from 'redux-saga/effects';
import { PROMISE_ACTION } from './constants'

export function* handlePromiseAction(action) {
  const { data, params, defer: { resolve, reject } } = action.payload;

  yield put(params.trigger());
  const [ { success, failure } ] = yield [
    race({
      success: take(params.SUCCESS),
      failure: take(params.FAILURE),
    }),
    put(params.request(data)),
  ];

  if (success) {
    yield call(resolve);
  } else {
    yield call(reject, failure && failure.payload ? failure.payload : failure);
  }

  yield put(params.fulfill());
}

export default function* routinesWatcherSaga() {
  yield takeEvery(PROMISE_ACTION, handlePromiseAction);
}
