/* eslint-disable no-unused-expressions */
import { describe, it } from 'mocha';
import { expect } from 'chai';

import {
  createRoutine,
  promisifyRoutine,
  bindPromiseCreators,
  bindRoutineToReduxForm,
  routinePromiseWatcherSaga,
  ROUTINE_PROMISE_ACTION,
 } from '../src';

describe('Redux saga routines', () => {
  it('should export createRoutine function', () => {
    expect(createRoutine).to.be.a('function');
  });

  it('should export bindPromiseCreators function', () => {
    expect(bindPromiseCreators).to.be.a('function');
  });

  it('should export bindRoutineToReduxForm function', () => {
    expect(bindRoutineToReduxForm).to.be.a('function');
  });

  it('should export routinePromiseWatcherSaga function', () => {
    expect(routinePromiseWatcherSaga).to.be.ok;
  });

  it('should export ROUTINE_PROMISE_ACTION action type', () => {
    expect(ROUTINE_PROMISE_ACTION).to.be.a('string');
  });

  it('should export promisifyRoutine function', () => {
    expect(promisifyRoutine).to.be.a('function');
  });
});
