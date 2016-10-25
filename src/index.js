import { takeEvery } from 'redux-saga';
import { take, race, put, call } from 'redux-saga/effects';

export const PROMISE_ACTION = '@@redux-saga-actions/PROMISE';

const identity = i => i;

const REQUEST = 'REQUEST';
const SUCCESS = 'SUCCESS';
const FAILURE = 'FAILURE';

const statuses = [REQUEST, SUCCESS, FAILURE];

export function createAction(requestAction, types, payloadCreator = identity) {
  const actionMethods = {};
  const action = (payload) => ({
    type: PROMISE_ACTION,
    payload,
  });

  // Allow a type prefix to be passed in
  if (typeof requestAction === 'string') {
    requestAction = statuses.map(status => {
      let actionType = `${requestAction}_${status}`;
      let subAction = payload => ({
        type: actionType,
        payload: payloadCreator(payload),
      });

      // translate specific actionType to generic actionType
      actionMethods[status] = actionType;
      actionMethods[status.toLowerCase()] = subAction;

      return subAction;
    })[0];

    if (types) {
      payloadCreator = types;
    }

    types = [actionMethods[SUCCESS], actionMethods[FAILURE]];
  }

  if (types.length !== 2) {
    throw new Error('Must include two action types: [ SUCCESS, FAILURE ]');
  }

  return Object.assign((data, dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch(action({
        types,
        request: requestAction(data),
        defer: { resolve, reject },
      }));
    });
  }, actionMethods);
}

export function* handleActionSaga({ payload }) {
  const { request, defer, types } = payload;
  const { resolve, reject } = defer;
  const [ SUCCESS, FAILURE ] = types;

  const [ { success, failure } ] = yield [
    race({
      success: take(SUCCESS),
      failure: take(FAILURE),
    }),
    put(request),
  ];

  if (success) {
    yield call(resolve, success);
  } else {
    yield call(reject, failure && failure.payload ? failure.payload : failure);
  }
}

export function* actionsWatcherSaga() {
  yield call(takeEvery, PROMISE_ACTION, handleActionSaga);
}

export default actionsWatcherSaga;
