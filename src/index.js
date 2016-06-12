import 'babel-polyfill';
import { take, race, put, call } from 'redux-saga/effects';

const identity = i => i;
const PROMISE = '@@redux-form-saga/PROMISE';

function createFormAction (requestAction, types, payloadCreator = identity) {
  const formAction = (payload) => ({
    type: PROMISE,
    payload: payloadCreator(payload)
  });

  if (types.length !== 2) {
    throw new Error('Must include two action types: [ SUCCESS, FAILURE ]');
  }

  return data => {
    return dispatch => {
      return new Promise((resolve, reject) => {
        dispatch(formAction({
          request: requestAction(data),
          defer: { resolve, reject },
          types
        }));
      });
    };
  };
};

function *formActionSaga () {
  while (true) {
    let action = yield take(PROMISE);
    let { request, defer, types } = action.payload;
    let { resolve, reject } = defer;
    let [ SUCCESS, FAIL ] = types;

    yield put(request);

    const winner = yield race({
      success: take(SUCCESS),
      fail: take(FAIL)
    });

    if (winner.success) {
      yield call(resolve, winner.success);
    } else {
      yield call(reject, winner.fail);
    }
  }
}

export {
  PROMISE,
  createFormAction,
  formActionSaga
}

export default formActionSaga;
