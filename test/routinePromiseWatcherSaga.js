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

  beforeEach(() => {
    rfHandler(values, (action) => {
      iterator = handleRoutinePromiseAction(action);
      resolve = action.payload.defer.resolve;
      reject = action.payload.defer.reject;
    }, props);
  });

  const run = (winner) => {
    // check if race between SUCCESS and FAILURE started
    // check if request action raised
    expect(iterator.next().value).to.deep.equal(all([
      race({ success: take(routine.SUCCESS), failure: take(routine.FAILURE) }),
      put(routine.trigger({ values, props })),
    ]));

    const getPayload = (data) => (data && data.payload) || data;
    const result = winner.success ? call(resolve) : call(reject, getPayload(winner.failure));
    // check if promise resolve / reject called
    expect(iterator.next([winner]).value).to.deep.equal(result);
    // check if saga done
    expect(iterator.next().done).to.equal(true);
  };

  it('resolves promise if got SUCCESS action', () => {
    run({ success: true });
  });

  it('rejects promise with failure if got FAILURE action and no payload provided', () => {
    run({ failure: true });
  });

  it('rejects promise with payload if got FAILURE action and payload provided', () => {
    run({ failure: { payload: 'failure payload' } });
  });
});
