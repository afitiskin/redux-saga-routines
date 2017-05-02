import 'babel-polyfill';
import { describe, it } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';

import createRoutine from '../src/createRoutine';
import bindRoutineCreators from '../src/bindRoutineCreators';

const checkRoutine = (routine, spy) => {
  expect(routine).to.be.a('function');

  routine();
  expect(spy.callCount).to.equal(1);

  routine.trigger();
  expect(spy.callCount).to.equal(2);

  routine.request();
  expect(spy.callCount).to.equal(3);

  routine.success();
  expect(spy.callCount).to.equal(4);

  routine.failure();
  expect(spy.callCount).to.equal(5);

  routine.fulfill();
  expect(spy.callCount).to.equal(6);
};

describe('bindRoutineCreators', () => {
  it('should be a function', () => {
    expect(bindRoutineCreators).to.be.a('function');
  });

  it('should bind passed routine to dispatch', () => {
    const dispatch = sinon.spy();
    const routine = createRoutine('SOMETHING');

    const boundRoutine = bindRoutineCreators(routine, dispatch);
    checkRoutine(boundRoutine, dispatch);
  });

  it('should bind each routine in passed object to dispatch', () => {
    const dispatch = sinon.spy();
    const routines = {
      a: createRoutine('A'),
      b: createRoutine('B'),
    };

    const boundRoutines = bindRoutineCreators(routines, dispatch);
    checkRoutine(boundRoutines.a, dispatch);
    dispatch.reset();
    checkRoutine(boundRoutines.b, dispatch);
  });
});
