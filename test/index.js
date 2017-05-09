/* eslint-disable no-unused-expressions */
import { describe, it } from 'mocha';
import { expect } from 'chai';

import { createRoutine, bindRoutineCreators, routinesWatcherSaga } from '../src';

describe('Redux saga routines', () => {
  it('should export createRoutine function', () => {
    expect(createRoutine).to.be.ok;
  });

  it('should export bindRoutineCreators function', () => {
    expect(bindRoutineCreators).to.be.ok;
  });

  it('should export routinesWatcherSaga function', () => {
    expect(routinesWatcherSaga).to.be.ok;
  });
});
