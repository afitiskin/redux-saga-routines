import { describe, it } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';

import bindRoutineToReduxForm from '../src/bindRoutineToReduxForm';
import { ROUTINE_PROMISE_ACTION } from '../src/constants';

describe('bindRoutineToReduxForm', () => {
  it('should be a function', () => {
    expect(bindRoutineToReduxForm).to.be.a('function');
  });

  it('should wrap routine into redux-form compatible function', () => {
    const routine = () => ({ something: true });
    const handler = bindRoutineToReduxForm(routine);
    const dispatch = sinon.spy();
    const values = {
      some: 'data',
    };
    const props = {
      x: 1,
      y: 2,
    };

    expect(handler(values, dispatch, props)).to.be.a('promise');
    expect(dispatch.calledOnce).to.equal(true);

    const call = dispatch.getCall(0);
    expect(call.args).to.have.length(1);

    const action = call.args[0];

    expect(action).to.have.property('type');
    expect(action.type).to.equal(ROUTINE_PROMISE_ACTION);

    expect(action).to.have.property('payload');

    expect(action.payload).to.have.property('values');
    expect(action.payload.values).to.deep.equal(values);

    expect(action.payload).to.have.property('props');
    expect(action.payload.props).to.deep.equal(props);

    expect(action).to.have.property('meta');

    expect(action.meta).to.have.property('defer');
    expect(action.meta.defer).to.have.property('resolve');
    expect(action.meta.defer).to.have.property('reject');

    expect(action.meta).to.have.property('routine');
    expect(action.meta.routine).to.equal(routine);

    expect(action.meta).to.have.property('reduxFormCompatible');
    expect(action.meta.reduxFormCompatible).to.equal(true);
  });
});
