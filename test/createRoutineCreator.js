import { describe, it } from 'mocha';
import { expect } from 'chai';

import createRoutineCreator from '../src/createRoutineCreator';

const stages = ['ONE', 'TWO', 'SOME_MORE'];

describe('createRoutineCreator', () => {
  it('should be a function', () => {
    expect(createRoutineCreator).to.be.a('function');
  });

  it('should throw an error if stages is not defined', () => {
    expect(() => createRoutineCreator()).to.throw();
  });

  it('should return routineCreator', () => {
    const createRoutine = createRoutineCreator(stages);
    expect(createRoutine).to.be.a('function');
    expect(createRoutine.STAGES).to.eq(stages);
  });

  it('should return routineCreator that produces routines', () => {
    const routine = createRoutineCreator(stages)('PREFIX');
    expect(routine).to.be.a('function');
    expect(routine._STAGES).to.eq(stages);
    expect(routine._PREFIX).to.equal('PREFIX');

    expect(routine.ONE).to.equal('PREFIX/ONE');
    expect(routine.TWO).to.equal('PREFIX/TWO');
    expect(routine.SOME_MORE).to.equal('PREFIX/SOME_MORE');

    expect(routine.one).to.be.a('function');
    expect(routine.two).to.be.a('function');
    expect(routine.someMore).to.be.a('function');
  });

  it('should allow to set custom action type separator', () => {
    const routine = createRoutineCreator(stages, '_')('PREFIX');

    expect(routine.ONE).to.equal('PREFIX_ONE');
    expect(routine.TWO).to.equal('PREFIX_TWO');
    expect(routine.SOME_MORE).to.equal('PREFIX_SOME_MORE');
  });
});
