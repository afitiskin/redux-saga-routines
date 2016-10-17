import { takeEvery } from 'redux-saga';
import { take, race, put, call, fork } from 'redux-saga/effects';

const identity = i => i;
const PROMISE = '@@redux-form-saga/PROMISE';
const status = ['REQUEST', 'SUCCESS', 'FAILURE'];

function createFormAction (requestAction, types, payloadCreator = identity) {
  const actionMethods = {};
  const formAction = (payload) => ({
    type: PROMISE,
    payload
  });

  // Allow a type prefix to be passed in
  if (typeof requestAction === 'string') {
    requestAction = status.map(s => {
      let a = `${requestAction}_${s}`;
      let subAction = payload => ({
        type: a,
        payload: payloadCreator(payload)
      });

      // translate specific actionType to generic actionType
      actionMethods[s] = a;
      actionMethods[s.toLowerCase()] = subAction;

      return subAction;
    })[0];

    if (types) {
      payloadCreator = types;
    }

    types = [ actionMethods.SUCCESS, actionMethods.FAILURE ];
  }

  if (types.length !== 2) {
    throw new Error('Must include two action types: [ SUCCESS, FAILURE ]');
  }

  return Object.assign((data, dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch(formAction({
        request: requestAction(data),
        defer: { resolve, reject },
        types
      }));
    });
  }, actionMethods);
};

function *handlePromiseSaga({ payload }) {
  const { request, defer, types } = payload;
  const { resolve, reject } = defer;
  const [ SUCCESS, FAIL ] = types;

  const [ winner ] = yield [
    race({
      success: take(SUCCESS),
      fail: take(FAIL),
    }),
    put(request),
  ];

  if (winner.success) {
    yield call(resolve, winner.success);
  } else {
    yield call(reject, winner.fail);
  }
}

function *formActionSaga() {
  yield call(takeEvery, PROMISE, handlePromiseSaga);
}

export {
  PROMISE,
  createFormAction,
  formActionSaga,
  handlePromiseSaga,
}

export default formActionSaga;
