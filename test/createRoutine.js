import 'babel-polyfill';
import { describe, it } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';

import createRoutine from '../src/createRoutine';
import { PROMISE_ACTION } from '../src/constants';

const PREFIX = 'PREFIX';

const TRIGGER = `${PREFIX}_TRIGGER`;
const REQUEST = `${PREFIX}_REQUEST`;
const SUCCESS = `${PREFIX}_SUCCESS`;
const FAILURE = `${PREFIX}_FAILURE`;
const FULFILL = `${PREFIX}_FULFILL`;

const data = {
  some: 'data',
};

describe('createRoutine', () => {
  it('should be a function', () => {
    expect(createRoutine).to.be.a('function');
  });

  it('should create a new routine', () => {
    const routine = createRoutine(PREFIX);
    const dispatch = sinon.spy();

    expect(routine).to.be.a('function');
    expect(routine(data, dispatch)).to.be.a('promise');
    expect(dispatch.calledOnce).to.equal(true);

    const call = dispatch.getCall(0);
    const action = call.args[0];

    expect(call.args).to.have.length(1);

    expect(action).to.have.property('type');
    expect(action).to.have.property('payload');

    expect(action.type).to.equal(PROMISE_ACTION);

    expect(action.payload).to.have.property('data');
    expect(action.payload.data).to.eql(data);

    expect(action.payload).to.have.property('defer');
    expect(action.payload.defer).to.have.property('resolve');
    expect(action.payload.defer).to.have.property('reject');

    expect(action.payload).to.have.property('params');

    expect(routine.TRIGGER).to.equal(TRIGGER);
    expect(routine.trigger).to.be.a('function');
    expect(routine.trigger(data)).to.eql({ type: TRIGGER, payload: data });

    expect(routine.REQUEST).to.equal(REQUEST);
    expect(routine.request).to.be.a('function');
    expect(routine.request(data)).to.eql({ type: REQUEST, payload: data });

    expect(routine.SUCCESS).to.equal(SUCCESS);
    expect(routine.success).to.be.a('function');
    expect(routine.success(data)).to.eql({ type: SUCCESS, payload: data });

    expect(routine.FAILURE).to.equal(FAILURE);
    expect(routine.failure).to.be.a('function');
    expect(routine.failure(data)).to.eql({ type: FAILURE, payload: data });

    expect(routine.FULFILL).to.equal(FULFILL);
    expect(routine.fulfill).to.be.a('function');
    expect(routine.fulfill(data)).to.eql({ type: FULFILL, payload: data });
  });
});
