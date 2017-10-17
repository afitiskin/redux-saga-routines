import { describe, it } from 'mocha';
import { expect } from 'chai';
import { takeEvery, take, race, put, call, all } from 'redux-saga/effects';

import routinesWatcherSaga, { handleRoutinePromiseAction } from '../src/routinePromiseWatcherSaga';
import { ROUTINE_PROMISE_ACTION } from '../src/constants';

import createRoutine from '../src/createRoutine';
import promisifyRoutine from '../src/promisifyRoutine';
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
  const handler = promisifyRoutine(routine);
  const rfHandler = bindRoutineToReduxForm(routine);

  const payload = {
    a: 4,
    b: 2,
  };

  const values = {
    x: 5,
    y: 8,
  };

  const props = {
    some: 'value',
    ok: true,
  };

  let iterator;
  let resolve;
  let reject;
  let run;

  const getRunner = (triggerPayload, reduxFormCompatible) => (winner) => {
    // check if race between SUCCESS and FAILURE started
    // check if request action raised
    expect(iterator.next().value).to.deep.equal(all([
      race({ success: take(routine.SUCCESS), failure: take(routine.FAILURE) }),
      put(routine.trigger(triggerPayload)),
    ]));

    const getWinnerPayload = (data) => (data && data.payload) || data;
    let result;
    if (winner.success) {
      result = reduxFormCompatible ? call(resolve) : call(resolve, getWinnerPayload(winner.success));
    } else {
      result = call(reject, getWinnerPayload(winner.failure));
    }

    // check if promise resolve / reject called
    expect(iterator.next([winner]).value).to.deep.equal(result);
    // check if saga done
    expect(iterator.next().done).to.equal(true);
  };

  describe('default version', () => {
    beforeEach(() => {
      run = getRunner(payload, false);
      handler(payload, (action) => {
        iterator = handleRoutinePromiseAction(action);
        resolve = action.meta.defer.resolve;
        reject = action.meta.defer.reject;
      });
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
      run = getRunner({ values, props }, true);
      rfHandler(values, (action) => {
        iterator = handleRoutinePromiseAction(action);
        resolve = action.meta.defer.resolve;
        reject = action.meta.defer.reject;
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
