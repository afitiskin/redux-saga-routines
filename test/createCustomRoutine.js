import { describe, it } from 'mocha';
import { expect } from 'chai';

import { createCustomRoutine } from '../src';

const PREFIX = 'PREFIX';
const TRIGGER = `${PREFIX}/TRIGGER`;
const REQUEST = `${PREFIX}/REQUEST`;
const SUCCESS = `${PREFIX}/SUCCESS`;
const FAILURE = `${PREFIX}/FAILURE`;
const FULFILL = `${PREFIX}/FULFILL`;

const SOME_LONG_TYPE = `${PREFIX}/SOME_LONG_TYPE`;
const payload = {
  some: 'data',
};
const triggerAction = {
  type: SOME_LONG_TYPE,
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

const someAction = {
  type: SOME_LONG_TYPE,
  payload,
}
const OTHER = `${PREFIX}/OTHER`;
const otherAction = {
  type: OTHER,
  payload,
}


describe('createExtendedRoutine', () => {
  it('should be a function', () => {
    expect(createCustomRoutine).to.be.a('function');
  });

  it('should create a custom routine', () => {
    const routine = createCustomRoutine(PREFIX, ['SOME_LONG_TYPE', 'OTHER']);

    expect(routine.someLongType).to.be.a('function');
    expect(routine.SOME_LONG_TYPE).to.equal(SOME_LONG_TYPE);
    expect(routine.someLongType.toString()).to.equal(SOME_LONG_TYPE);
    expect(routine.someLongType(payload)).to.deep.equal(someAction);

    expect(routine.other).to.be.a('function');
    expect(routine.OTHER).to.equal(OTHER);
    expect(routine.other.toString()).to.equal(OTHER);
    expect(routine.other(payload)).to.deep.equal(otherAction);
  });

  it('should create an extened routine if types arg is a string', () => {
    const routine = createCustomRoutine(PREFIX, 'SOME_LONG_TYPE');

    expect(routine).to.be.a('function');
    expect(routine.toString()).to.equal(SOME_LONG_TYPE);
    expect(routine(payload)).to.deep.equal(triggerAction);

    expect(routine.someLongType).to.be.a('function');
    expect(routine.SOME_LONG_TYPE).to.equal(SOME_LONG_TYPE);
    expect(routine.someLongType.toString()).to.equal(SOME_LONG_TYPE);
    expect(routine.someLongType(payload)).to.deep.equal(triggerAction);

  });

  it('should create extended routine with provided payload creators', () => {
    const routine = createCustomRoutine(PREFIX, ['SOME_LONG_TYPE', 'OTHER'], {
      someLongType: (payload) => payload * 7,
      other: (payload) => payload * 8,
    });

    const SOME_LONG_TYPE = `${PREFIX}/SOME_LONG_TYPE`
    const OTHER = `${PREFIX}/OTHER`
    const originalPayload = 42;

    const someLongTypeAction = {
      type: SOME_LONG_TYPE,
      payload: 294, // originalPayload * 7,
    }
    const otherAction = {
      type: OTHER,
      payload: 336, // originalPayload * 8,
    }

    expect(routine).to.be.a('function');
    expect(routine.toString()).to.equal(SOME_LONG_TYPE);
    expect(routine(originalPayload)).to.deep.equal(someLongTypeAction);

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
    const someLongTypeMeta = { test: 'someLongTypeMeta' };

    const routine = createCustomRoutine(PREFIX, 'SOME_LONG_TYPE', (payload) => payload, {
      someLongType: () => someLongTypeMeta,
    });

    const SOME_LONG_TYPE = `${PREFIX}/SOME_LONG_TYPE`
    const payload = {
      some: 'data',
    };
    const someLongTypeAction = {
      type: SOME_LONG_TYPE,
      payload,
      meta: someLongTypeMeta,
    };


    expect(routine).to.be.a('function');
    expect(routine.toString()).to.equal(SOME_LONG_TYPE);
    expect(routine(payload)).to.deep.equal(someLongTypeAction);

    expect(routine.someLongType).to.be.a('function');
    expect(routine.SOME_LONG_TYPE).to.equal(SOME_LONG_TYPE);
    expect(routine.someLongType.toString()).to.equal(SOME_LONG_TYPE);
    expect(routine.someLongType(payload)).to.deep.equal(someLongTypeAction);

  });
});
