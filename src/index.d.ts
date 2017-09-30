declare module "redux-saga-routines" {
    import { Dispatch } from 'redux';
    import { ActionFunction0, ActionFunction1, ActionFunction2, ActionFunction3, ActionFunction4, Action, ActionFunctionAny, ActionMeta } from 'redux-actions';

    export interface RoutineTypes {
        TRIGGER: string,
        REQUEST: string,
        SUCCESS: string,
        FAILURE: string,
        FULFILL: string
    }

    export interface RoutineActionCreators<T> {
        trigger: T,
        request: T,
        success: T,
        failure: T,
        fulfill: T,
    }

    export type Routine<T> = RoutineTypes & RoutineActionCreators<T> & T;

    export function routinePromiseWatcherSaga(): Generator;

    export function createRoutine(
        typePrefix: string
    ): Routine<ActionFunction0<Action<void>>>;

    export function createRoutine<Payload>(
        typePrefix: string,
        payloadCreator: ActionFunction0<Payload>
    ): Routine<ActionFunction0<Action<Payload>>>;

    export function createRoutine<Payload, Arg1>(
        typePrefix: string,
        payloadCreator: ActionFunction1<Arg1, Payload>
    ): Routine<ActionFunction1<Arg1, Action<Payload>>>;

    export function createRoutine<Payload, Arg1, Arg2>(
        typePrefix: string,
        payloadCreator: ActionFunction2<Arg1, Arg2, Payload>
    ): Routine<ActionFunction2<Arg1, Arg2, Action<Payload>>>;

    export function createRoutine<Payload, Arg1, Arg2, Arg3>(
        typePrefix: string,
        payloadCreator: ActionFunction3<Arg1, Arg2, Arg3, Payload>
    ): Routine<ActionFunction3<Arg1, Arg2, Arg3, Action<Payload>>>;

    export function createRoutine<Payload, Arg1, Arg2, Arg3, Arg4>(
        typePrefix: string,
        payloadCreator: ActionFunction4<Arg1, Arg2, Arg3, Arg4, Payload>
    ): Routine<ActionFunction4<Arg1, Arg2, Arg3, Arg4, Action<Payload>>>;

    export function createRoutine<Payload>(
        typePrefix: string
    ): Routine<ActionFunction1<Payload, Action<Payload>>>;

    export function createRoutine<Payload, Meta>(
        typePrefix: string,
        payloadCreator: ActionFunctionAny<Payload>,
        metaCreator: ActionFunctionAny<Meta>
    ): Routine<ActionFunctionAny<ActionMeta<Payload, Meta>>>;

    export function createRoutine<Payload, Meta, Arg1>(
        typePrefix: string,
        payloadCreator: ActionFunction1<Arg1, Payload>,
        metaCreator: ActionFunction1<Arg1, Meta>
    ): Routine<ActionFunction1<Arg1, ActionMeta<Payload, Meta>>>;

    export function createRoutine<Payload, Meta, Arg1, Arg2>(
        typePrefix: string,
        payloadCreator: ActionFunction2<Arg1, Arg2, Payload>,
        metaCreator: ActionFunction2<Arg1, Arg2, Meta>
    ): Routine<ActionFunction2<Arg1, Arg2, ActionMeta<Payload, Meta>>>;

    export function createRoutine<Payload, Meta, Arg1, Arg2, Arg3>(
        typePrefix: string,
        payloadCreator: ActionFunction3<Arg1, Arg2, Arg3, Payload>,
        metaCreator: ActionFunction3<Arg1, Arg2, Arg3, Meta>
    ): Routine<ActionFunction3<Arg1, Arg2, Arg3, ActionMeta<Payload, Meta>>>;

    export function createRoutine<Payload, Meta, Arg1, Arg2, Arg3, Arg4>(
        typePrefix: string,
        payloadCreator: ActionFunction4<Arg1, Arg2, Arg3, Arg4, Payload>,
        metaCreator: ActionFunction4<Arg1, Arg2, Arg3, Arg4, Meta>
    ): Routine<ActionFunction4<Arg1, Arg2, Arg3, Arg4, ActionMeta<Payload, Meta>>>;

    export function bindRoutineToReduxForm<T>(routine: Routine<T>): (values: any, dispatch: Dispatch<any>, props: any) => Promise<any>;

    export const ROUTINE_PROMISE_ACTION: string;
}
