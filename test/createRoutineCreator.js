import { describe, it } from 'mocha';
import { expect } from 'chai';

import createRoutineCreator from '../src/createRoutineCreator';


describe('createRoutineCreator', () => {
  it('should be a function', () => {
    expect(createRoutineCreator).to.be.a('function');
  });

  it('should throw an error if stages is not defined', () => {
    expect(() => createRoutineCreator()).to.throw('stages is undefined');
  });

  it('should throw an error if prefix is not defined', () => {
    const createSomeRoutine = createRoutineCreator('SOME_STAGE');
    expect(() => createSomeRoutine()).to.throw('typePrefix is undefined');
  });

});
