import { describe, it } from 'mocha';
import { expect } from 'chai';

import { createRoutine, extendRoutine } from '../src/index';

const PREFIX = 'PREFIX';
const TRIGGER = `${PREFIX}/TRIGGER`;
const REQUEST = `${PREFIX}/REQUEST`;
const SUCCESS = `${PREFIX}/SUCCESS`;
const FAILURE = `${PREFIX}/FAILURE`;
const FULFILL = `${PREFIX}/FULFILL`;

describe('extendRoutine', () => {
  it('should be a function', () => {
    expect(extendRoutine).to.be.a('function');
  });

  it('should create the same routine as createRoutine', () => {
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

  it('should create extened routine', () => {
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

    const SOME = `${PREFIX}/SOME`;

    const someAction = {
      type: SOME,
      payload,
    }

    const routine = extendRoutine(createRoutine(PREFIX), ['SOME']);

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

    expect(routine.some).to.be.a('function');
    expect(routine.SOME).to.equal(SOME);
    expect(routine.some.toString()).to.equal(SOME);
    expect(routine.some(payload)).to.deep.equal(someAction);
  });

});
