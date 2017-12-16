import { describe, it } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';

import bindPromiseCreators from '../src/bindPromiseCreators';

describe('bindPromiseCreators', () => {
  it('should be a function', () => {
    expect(bindPromiseCreators).to.be.a('function');
  });

  const dispatch = () => undefined;
  const payload = {
    some: 'data',
  };

  const test = (spy, bound) => {
    expect(bound).to.be.a('function');
    expect(spy.calledOnce).to.equal(false);
    bound(payload);
    expect(spy.calledOnce).to.equal(true);

    const call = spy.getCall(0);
    expect(call.args).to.have.length(2);
    expect(call.args[0]).to.equal(payload);
    expect(call.args[1]).to.equal(dispatch);
  };

  it('should take function as a first argument and bind it to dispatch function', () => {
    const spy = sinon.spy();
    const bound = bindPromiseCreators(spy, dispatch);

    test(spy, bound);
  });

  it('should take map of functions as a first argument and bind all of them to dispatch function', () => {
    const map = {
      key1: sinon.spy(),
      key2: sinon.spy(),
    };
    const boundMap = bindPromiseCreators(map, dispatch);

    expect(boundMap).to.be.a('object');
    expect(boundMap).to.have.property('key1');
    test(map.key1, boundMap.key1);
    expect(boundMap).to.have.property('key2');
    test(map.key2, boundMap.key2);
  });
});
