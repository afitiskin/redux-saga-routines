import { describe, it } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';

import promisifyRoutine from '../src/promisifyRoutine';
import { ROUTINE_PROMISE_ACTION } from '../src/constants';

describe('promisifyRoutine', () => {
  it('should be a function', () => {
    expect(promisifyRoutine).to.be.a('function');
  });

  it('should wrap routine into function that returns promise', () => {
    const routine = () => ({ something: true });
    const handler = promisifyRoutine(routine);
    const dispatch = sinon.spy();
    const payload = {
      some: 'data',
    };

    expect(handler(payload, dispatch)).to.be.a('promise');
    expect(dispatch.calledOnce).to.equal(true);

    const call = dispatch.getCall(0);
    expect(call.args).to.have.length(1);

    const action = call.args[0];

    expect(action).to.have.property('type');
    expect(action.type).to.equal(ROUTINE_PROMISE_ACTION);

    expect(action).to.have.property('payload');
    expect(action.payload).to.deep.equal(payload);

    expect(action).to.have.property('meta');

    expect(action.meta).to.have.property('defer');
    expect(action.meta.defer).to.have.property('resolve');
    expect(action.meta.defer).to.have.property('reject');

    expect(action.meta).to.have.property('routine');
    expect(action.meta.routine).to.equal(routine);
  });
});
