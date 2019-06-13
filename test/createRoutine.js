import { describe, it } from 'mocha';
import { expect } from 'chai';

import createRoutine from '../src/createRoutine';

const PREFIX = 'PREFIX';
const TRIGGER = `${PREFIX}/TRIGGER`;
const REQUEST = `${PREFIX}/REQUEST`;
const SUCCESS = `${PREFIX}/SUCCESS`;
const FAILURE = `${PREFIX}/FAILURE`;
const FULFILL = `${PREFIX}/FULFILL`;

describe('createRoutine', () => {
  it('should be a function', () => {
    expect(createRoutine).to.be.a('function');
  });

  it('should create new routine', () => {
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

    const routine = createRoutine(PREFIX);

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

  it('should create new routine with provided payload creator', () => {
    const routine = createRoutine(PREFIX, (payload) => payload * 2);

    const originalPayload = 42;
    const payload = 84;

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

    expect(routine).to.be.a('function');
    expect(routine.toString()).to.equal(TRIGGER);
    expect(routine(originalPayload)).to.deep.equal(triggerAction);

    expect(routine.trigger).to.be.a('function');
    expect(routine.TRIGGER).to.equal(TRIGGER);
    expect(routine.trigger.toString()).to.equal(TRIGGER);
    expect(routine.trigger(originalPayload)).to.deep.equal(triggerAction);

    expect(routine.request).to.be.a('function');
    expect(routine.REQUEST).to.equal(REQUEST);
    expect(routine.request.toString()).to.equal(REQUEST);
    expect(routine.request(originalPayload)).to.deep.equal(requestAction);

    expect(routine.success).to.be.a('function');
    expect(routine.SUCCESS).to.equal(SUCCESS);
    expect(routine.success.toString()).to.equal(SUCCESS);
    expect(routine.success(originalPayload)).to.deep.equal(successAction);

    expect(routine.failure).to.be.a('function');
    expect(routine.FAILURE).to.equal(FAILURE);
    expect(routine.failure.toString()).to.equal(FAILURE);
    expect(routine.failure(originalPayload)).to.deep.equal(failureAction);

    expect(routine.fulfill).to.be.a('function');
    expect(routine.FULFILL).to.equal(FULFILL);
    expect(routine.fulfill.toString()).to.equal(FULFILL);
    expect(routine.fulfill(originalPayload)).to.deep.equal(fulfillAction);
  });

  it('should create new routine with provided payload creators for each action type', () => {
    const routine = createRoutine(PREFIX, {
      trigger: (payload) => payload * 2,
      request: (payload) => payload * 3,
      success: (payload) => payload * 4,
      failure: (payload) => payload * 5,
      fulfill: (payload) => payload * 6,
    });

    const originalPayload = 42;

    const triggerAction = {
      type: TRIGGER,
      payload: 84, // originalPayload * 2
    };
    const requestAction = {
      type: REQUEST,
      payload: 126, // originalPayload * 3,
    };
    const successAction = {
      type: SUCCESS,
      payload: 168, // originalPayload * 4,
    };
    const failureAction = {
      type: FAILURE,
      payload: 210, // originalPayload * 5,
    };
    const fulfillAction = {
      type: FULFILL,
      payload: 252, // originalPayload * 6,
    };

    expect(routine).to.be.a('function');
    expect(routine.toString()).to.equal(TRIGGER);
    expect(routine(originalPayload)).to.deep.equal(triggerAction);

    expect(routine.trigger).to.be.a('function');
    expect(routine.TRIGGER).to.equal(TRIGGER);
    expect(routine.trigger.toString()).to.equal(TRIGGER);
    expect(routine.trigger(originalPayload)).to.deep.equal(triggerAction);

    expect(routine.request).to.be.a('function');
    expect(routine.REQUEST).to.equal(REQUEST);
    expect(routine.request.toString()).to.equal(REQUEST);
    expect(routine.request(originalPayload)).to.deep.equal(requestAction);

    expect(routine.success).to.be.a('function');
    expect(routine.SUCCESS).to.equal(SUCCESS);
    expect(routine.success.toString()).to.equal(SUCCESS);
    expect(routine.success(originalPayload)).to.deep.equal(successAction);

    expect(routine.failure).to.be.a('function');
    expect(routine.FAILURE).to.equal(FAILURE);
    expect(routine.failure.toString()).to.equal(FAILURE);
    expect(routine.failure(originalPayload)).to.deep.equal(failureAction);

    expect(routine.fulfill).to.be.a('function');
    expect(routine.FULFILL).to.equal(FULFILL);
    expect(routine.fulfill.toString()).to.equal(FULFILL);
    expect(routine.fulfill(originalPayload)).to.deep.equal(fulfillAction);
  });

  it('should create new routine with provided meta creator', () => {
    const triggerMeta = { test: 'triggerMeta' };
    const requestMeta = { test: 'requestMeta' };
    const successMeta = { test: 'successMeta' };
    const failureMeta = { test: 'failureMeta' };
    const fulfillMeta = { test: 'fulfillMeta' };
    const routine = createRoutine(PREFIX, (payload) => payload, {
      trigger: () => triggerMeta,
      request: () => requestMeta,
      success: () => successMeta,
      failure: () => failureMeta,
      fulfill: () => fulfillMeta,
    });

    const payload = {
      some: 'data',
    };

    const triggerAction = {
      type: TRIGGER,
      payload,
      meta: triggerMeta,
    };
    const requestAction = {
      type: REQUEST,
      payload,
      meta: requestMeta,
    };
    const successAction = {
      type: SUCCESS,
      payload,
      meta: successMeta,
    };
    const failureAction = {
      type: FAILURE,
      payload,
      meta: failureMeta,
    };
    const fulfillAction = {
      type: FULFILL,
      payload,
      meta: fulfillMeta,
    };

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
});
