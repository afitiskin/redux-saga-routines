import 'babel-polyfill';
import { describe, it } from 'mocha';
import { expect } from 'chai';
import { takeEvery, take, race, put, call } from 'redux-saga/effects';

import routinesWatcherSaga, { handlePromiseAction } from '../src/routinesWatcherSaga';
import { PROMISE_ACTION } from '../src/constants';
import createRoutine from '../src/createRoutine';

const noop = () => undefined;

describe('routinesWatcherSaga', () => {
  it('take every promise action and run promise handler', () => {
    const iterator = routinesWatcherSaga();

    expect(iterator.next().value).to.eql(takeEvery(PROMISE_ACTION, handlePromiseAction));
    expect(iterator.next().done).to.equal(true);
  });
});

describe('handlePromiseAction saga', () => {
  const routine = createRoutine('A');
  const data = 'some data';

  let iterator;
  let resolve;
  let reject;

  beforeEach(() => {
    routine(data, (action) => {
      iterator = handlePromiseAction(action);
      resolve = action.payload.defer.resolve;
      reject = action.payload.defer.reject;
    });
  });

  const run = (winner) => {
    // check if race between SUCCESS and FAILURE started
    // check if request action raised
    expect(iterator.next().value).to.deep.equal([
      race({ success: take(routine.SUCCESS), failure: take(routine.FAILURE) }),
      put(routine.trigger(data)),
    ]);

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
