import { describe, it } from 'mocha';
import { expect } from 'chai';

import { createExtendedRoutine } from '../src';

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


describe('createExtendedRoutine', () => {
  it('should be a function', () => {
    expect(createExtendedRoutine).to.be.a('function');
  });

  it('should create an extended routine', () => {
    const routine = createExtendedRoutine(PREFIX, ['SOME_LONG_TYPE', 'OTHER']);

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

    expect(routine.someLongType).to.be.a('function');
    expect(routine.SOME_LONG_TYPE).to.equal(SOME);
    expect(routine.someLongType.toString()).to.equal(SOME);
    expect(routine.someLongType(payload)).to.deep.equal(someAction);

    expect(routine.other).to.be.a('function');
    expect(routine.OTHER).to.equal(OTHER);
    expect(routine.other.toString()).to.equal(OTHER);
    expect(routine.other(payload)).to.deep.equal(otherAction);
  });

  it('should create an extened routine if types arg is a string', () => {
    const routine = createExtendedRoutine(PREFIX, 'SOME_LONG_TYPE');

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

    expect(routine.someLongType).to.be.a('function');
    expect(routine.SOME_LONG_TYPE).to.equal(SOME);
    expect(routine.someLongType.toString()).to.equal(SOME);
    expect(routine.someLongType(payload)).to.deep.equal(someAction);
  });

  it('should create extended routine with provided payload creators', () => {
    const routine = createExtendedRoutine(PREFIX, ['SOME_LONG_TYPE', 'OTHER'], {
      trigger: (payload) => payload * 2,
      request: (payload) => payload * 3,
      success: (payload) => payload * 4,
      failure: (payload) => payload * 5,
      fulfill: (payload) => payload * 6,
      someLongType: (payload) => payload * 7,
      other: (payload) => payload * 8,
    });

    const SOME_LONG_TYPE = `${PREFIX}/SOME_LONG_TYPE`
    const OTHER = `${PREFIX}/OTHER`
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
    const someLongTypeAction = {
      type: SOME_LONG_TYPE,
      payload: 294, // originalPayload * 7,
    }
    const otherAction = {
      type: OTHER,
      payload: 336, // originalPayload * 8,
    }

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

    expect(routine.someLongType).to.be.a('function');
    expect(routine.SOME_LONG_TYPE).to.equal(SOME_LONG_TYPE);
    expect(routine.someLongType.toString()).to.equal(SOME_LONG_TYPE);
    expect(routine.someLongType(originalPayload)).to.deep.equal(someLongTypeAction);

    expect(routine.other).to.be.a('function');
    expect(routine.OTHER).to.equal(OTHER);
    expect(routine.other.toString()).to.equal(OTHER);
    expect(routine.other(originalPayload)).to.deep.equal(otherAction);
  });

  it('should create new routine with provided meta creator', () => {
    const triggerMeta = { test: 'triggerMeta' };
    const requestMeta = { test: 'requestMeta' };
    const successMeta = { test: 'successMeta' };
    const failureMeta = { test: 'failureMeta' };
    const fulfillMeta = { test: 'fulfillMeta' };
    const someLongTypeMeta = { test: 'someLongTypeMeta' };

    const routine = createExtendedRoutine(PREFIX, 'SOME_LONG_TYPE', (payload) => payload, {
      trigger: () => triggerMeta,
      request: () => requestMeta,
      success: () => successMeta,
      failure: () => failureMeta,
      fulfill: () => fulfillMeta,
      someLongType: () => someLongTypeMeta,
    });

    const SOME_LONG_TYPE = `${PREFIX}/SOME_LONG_TYPE`

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
    const someLongTypeAction = {
      type: SOME_LONG_TYPE,
      payload,
      meta: someLongTypeMeta,
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

    expect(routine.someLongType).to.be.a('function');
    expect(routine.SOME_LONG_TYPE).to.equal(SOME_LONG_TYPE);
    expect(routine.someLongType.toString()).to.equal(SOME_LONG_TYPE);
    expect(routine.someLongType(payload)).to.deep.equal(someLongTypeAction);
  });
});
