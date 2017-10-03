import { describe, it } from 'mocha';
import { expect } from 'chai';
import { takeEvery, take, race, put, call, all } from 'redux-saga/effects';

import routinesWatcherSaga, { handleRoutinePromiseAction } from '../src/routinePromiseWatcherSaga';
import { ROUTINE_PROMISE_ACTION } from '../src/constants';

import createRoutine from '../src/createRoutine';
import bindRoutineToReduxForm from '../src/bindRoutineToReduxForm';

describe('routinePromiseWatcherSaga', () => {
  it('take every routine promise action and run promise handler', () => {
    const iterator = routinesWatcherSaga();

    expect(iterator.next().value).to.eql(takeEvery(ROUTINE_PROMISE_ACTION, handleRoutinePromiseAction));
    expect(iterator.next().done).to.equal(true);
  });
});

describe('handleRoutinePromiseAction saga', () => {
  const routine = createRoutine('A');
  const rfHandler = bindRoutineToReduxForm(routine);

  const values = {
    a: 4,
    b: 2,
  };
  const props = {
    x: 1,
    y: 2,
  };

  let iterator;
  let resolve;
  let reject;

  const run = (winner, reduxFormCompatible = false) => {
    // check if race between SUCCESS and FAILURE started
    // check if request action raised
    expect(iterator.next().value).to.deep.equal(all([
      race({ success: take(routine.SUCCESS), failure: take(routine.FAILURE) }),
      put(routine.trigger({ values, props })),
    ]));

    const getPayload = (data) => (data && data.payload) || data;
    let result;
    if (winner.success) {
      result = reduxFormCompatible ? call(resolve) : call(resolve, getPayload(winner.success));
    } else {
      result = call(reject, getPayload(winner.failure));
    }

    // check if promise resolve / reject called
    expect(iterator.next([winner]).value).to.deep.equal(result);
    // check if saga done
    expect(iterator.next().done).to.equal(true);
  };

  describe('default version', () => {
    beforeEach(() => {
      resolve = () => 'resolve';
      reject = () => 'reject';

      const action = {
        type: ROUTINE_PROMISE_ACTION,
        payload: {
          values,
          props,
          routine,
          defer: { resolve, reject },
        },
      };

      iterator = handleRoutinePromiseAction(action);
    });

    it('resolves promise if got SUCCESS action', () => {
      run({ success: true });
    });

    it('resolves promise with payload if got SUCCESS action and payload provided', () => {
      run({ success: { payload: 'success payload' } });
    });

    it('rejects promise with failure if got FAILURE action and no payload provided', () => {
      run({ failure: true });
    });

    it('rejects promise with payload if got FAILURE action and payload provided', () => {
      run({ failure: { payload: 'failure payload' } });
    });
  });

  describe('redux-form compatible version', () => {
    beforeEach(() => {
      rfHandler(values, (action) => {
        iterator = handleRoutinePromiseAction(action);
        resolve = action.payload.defer.resolve;
        reject = action.payload.defer.reject;
      }, props);
    });

    it('resolves promise if got SUCCESS action', () => {
      run({ success: true }, true);
    });

    it('resolves promise without payload if got SUCCESS action and payload provided', () => {
      run({ success: { payload: 'success payload' } }, true);
    });

    it('rejects promise with failure if got FAILURE action and no payload provided', () => {
      run({ failure: true }, true);
    });

    it('rejects promise with payload if got FAILURE action and payload provided', () => {
      run({ failure: { payload: 'failure payload' } }, true);
    });
  });
});
