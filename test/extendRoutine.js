import { describe, it } from 'mocha';
import { expect } from 'chai';

import { createRoutine, extendRoutine } from '../src';

const PREFIX = 'PREFIX';
const TRIGGER = `${PREFIX}/TRIGGER`;
const REQUEST = `${PREFIX}/REQUEST`;
const SUCCESS = `${PREFIX}/SUCCESS`;
const FAILURE = `${PREFIX}/FAILURE`;
const FULFILL = `${PREFIX}/FULFILL`;
const payload = {
  some: 'data',
};
const triggerAction = {
  type: TRIGGER,
  payload,
};
const requestAction = {
  type: REQUEST,
  payload,
};
const successAction = {
  type: SUCCESS,
  payload,
};
const failureAction = {
  type: FAILURE,
  payload,
};
const fulfillAction = {
  type: FULFILL,
  payload,
};
const SOME = `${PREFIX}/SOME_LONG_TYPE`;
const someAction = {
  type: SOME,
  payload,
}
const OTHER = `${PREFIX}/OTHER`;
const otherAction = {
  type: OTHER,
  payload,
}

describe('extendRoutine', () => {
  it('should be a function', () => {
    expect(extendRoutine).to.be.a('function');
  });

  it('should return the same routine as createRoutine returns', () => {

    const routine = extendRoutine(createRoutine(PREFIX));

    expect(routine).to.be.a('function');
    expect(routine.toString()).to.equal(TRIGGER);
    expect(routine(payload)).to.deep.equal(triggerAction);

    expect(routine.trigger).to.be.a('function');
    expect(routine.TRIGGER).to.equal(TRIGGER);
    expect(routine.trigger.toString()).to.equal(TRIGGER);
    expect(routine.trigger(payload)).to.deep.equal(triggerAction);

    expect(routine.request).to.be.a('function');
    expect(routine.REQUEST).to.equal(REQUEST);
    expect(routine.request.toString()).to.equal(REQUEST);
    expect(routine.request(payload)).to.deep.equal(requestAction);

    expect(routine.success).to.be.a('function');
    expect(routine.SUCCESS).to.equal(SUCCESS);
    expect(routine.success.toString()).to.equal(SUCCESS);
    expect(routine.success(payload)).to.deep.equal(successAction);

    expect(routine.failure).to.be.a('function');
    expect(routine.FAILURE).to.equal(FAILURE);
    expect(routine.failure.toString()).to.equal(FAILURE);
    expect(routine.failure(payload)).to.deep.equal(failureAction);

    expect(routine.fulfill).to.be.a('function');
    expect(routine.FULFILL).to.equal(FULFILL);
    expect(routine.fulfill.toString()).to.equal(FULFILL);
    expect(routine.fulfill(payload)).to.deep.equal(fulfillAction);
  });


  it('should create an extened routine', () => {

    const routine = extendRoutine(createRoutine(PREFIX), ['SOME_LONG_TYPE', 'OTHER']);

    expect(routine.someLongType).to.be.a('function');
    expect(routine.SOME_LONG_TYPE).to.equal(SOME);
    expect(routine.someLongType.toString()).to.equal(SOME);
    expect(routine.someLongType(payload)).to.deep.equal(someAction);

    expect(routine.other).to.be.a('function');
    expect(routine.OTHER).to.equal(OTHER);
    expect(routine.other.toString()).to.equal(OTHER);
    expect(routine.other(payload)).to.deep.equal(otherAction);
  });

  it('should create extened routine if types arg is string', () => {

    const routine = extendRoutine(createRoutine(PREFIX), ['SOME_LONG_TYPE']);

    expect(routine.someLongType).to.be.a('function');
    expect(routine.SOME_LONG_TYPE).to.equal(SOME);
    expect(routine.someLongType.toString()).to.equal(SOME);
    expect(routine.someLongType(payload)).to.deep.equal(someAction);
  });

});
