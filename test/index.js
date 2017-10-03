/* eslint-disable no-unused-expressions */
import { describe, it } from 'mocha';
import { expect } from 'chai';

import { createRoutine, bindRoutineToReduxForm, routinePromiseWatcherSaga } from '../src';

describe('Redux saga routines', () => {
  it('should export createRoutine function', () => {
    expect(createRoutine).to.be.ok;
  });

  it('should export bindRoutineToReduxForm function', () => {
    expect(bindRoutineToReduxForm).to.be.ok;
  });

  it('should export routinePromiseWatcherSaga function', () => {
    expect(routinePromiseWatcherSaga).to.be.ok;
  });
});
