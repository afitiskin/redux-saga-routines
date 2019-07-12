import routineStages from './routineStages';
import createRoutineCreator from './createRoutineCreator';

const createRoutine = createRoutineCreator(routineStages);
export default createRoutine;
