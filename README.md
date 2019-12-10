# redux-saga-routines
A smart action creator for [Redux](https://github.com/reactjs/redux). Useful for any kind of async actions like fetching data.
Also fully compatible with [Redux Saga](https://github.com/yelouafi/redux-saga) and [Redux Form](https://github.com/erikras/redux-form).

## Why do I need this?

Reduce boilerplate from your source code when making requests to API or validating forms build on top of [Redux Form](https://github.com/erikras/redux-form).

## Installation

```shell
yarn add redux-saga-routines
```

or

```shell
npm install --save redux-saga-routines
```

## What is routine?
Routine is a smart action creator that encapsulates 5 action types and 5 action creators to make standard actions lifecycle easy-to-use:

`TRIGGER` -> `REQUEST` -> `SUCCESS` / `FAILURE` -> `FULFILL`

So, with `redux-saga-routines` you don't need to create all these action type constants and action creators manually, just use `createRoutine`:

```javascript
import { createRoutine } from 'redux-saga-routines';

// creating routine
const routine = createRoutine('ACTION_TYPE_PREFIX');
```

`'ACTION_TYPE_PREFIX'` passed to `createRoutine` is a name of routine (and a prefix for all it's action types).

You can access all action types using `TRIGGER`, `REQUEST`, `SUCCESS`, `FAILURE`, `FULFILL` attributes of `routine` object:
```javascript
console.log(routine.TRIGGER); 
// 'ACTION_TYPE_PREFIX/TRIGGER';

console.log(routine.REQUEST); 
// 'ACTION_TYPE_PREFIX/REQUEST';

console.log(routine.SUCCESS); 
// 'ACTION_TYPE_PREFIX/SUCCESS';

console.log(routine.FAILURE); 
// 'ACTION_TYPE_PREFIX/FAILURE';

console.log(routine.FULFILL); 
// 'ACTION_TYPE_PREFIX/FULFILL';
```

You also have 5 action creators: `trigger`, `request`, `success`, `failure`, `fulfill`:
```javascript
console.log(routine.trigger(payload)); 
// { type: 'ACTION_TYPE_PREFIX/TRIGGER', payload };

console.log(routine.request(payload)); 
// { type: 'ACTION_TYPE_PREFIX/REQUEST', payload };

console.log(routine.success(payload)); 
// { type: 'ACTION_TYPE_PREFIX/SUCCESS', payload };

console.log(routine.failure(payload)); 
// { type: 'ACTION_TYPE_PREFIX/FAILURE', payload };

console.log(routine.fulfill(payload)); 
// { type: 'ACTION_TYPE_PREFIX/FULFILL', payload };
```

Routine by itself is a trigger action creator function:
```javascript
// following calls will give you the same result
console.log(routine(payload)); // { type: 'ACTION_TYPE_PREFIX/TRIGGER', payload };
console.log(routine.trigger(payload)); // { type: 'ACTION_TYPE_PREFIX/TRIGGER', payload };
```

Every routine's action creator is a [Flux Standard Action](https://github.com/redux-utilities/flux-standard-action)

## Payload and meta creators for routines
`redux-saga-routines` based on [redux-actions](https://github.com/reduxactions/redux-actions), so `createRoutine` actually accepts 3 parameters: `(actionTypePrefix, payloadCreator, metaCreator) => function`.

### Changing action payload with `payloadCreator`

You may pass a function as a second argument to `createRoutine` and it will be used as a payload creator:

```javascript
const routine = createRoutine('PREFIX', (value) => value * 2);

console.log(routine.trigger(1)); 
// { type: 'PREFIX/TRIGGER', payload: 2 }

console.log(routine.request(2)); 
// { type: 'PREFIX/TRIGGER', payload: 4 }

console.log(routine.success(3)); 
// { type: 'PREFIX/TRIGGER', payload: 6 }

console.log(routine.failure(4)); 
// { type: 'PREFIX/TRIGGER', payload: 8 }

console.log(routine.fulfill(5));
// { type: 'PREFIX/TRIGGER', payload: 10 }
````

You may also pass object as a second argument to define unique payload creator for each action:

```javascript
const payloadCreator = {
  trigger: (payload) => ({ ...payload, trigger: true }), // we may use payload creator to extend payload
  request: ({ id }) => ({ id }), // or to filter its values
  success: (payload) => ({ ...payload, data: parseData(payload.data) }), // or to change payload on the fly 
  failure: (payload) => ({ errorMessage: parseError(payload.error), error: true }), // or to do all of these at once
  fulfill: () => ({}), // or to completely change/remove payload ...
};

const routine = createRoutine('PREFIX', payloadCreator); // passing object as a second parameter

console.log(routine.trigger({ id: 42 })); 
// { type: 'PREFIX/TRIGGER', payload: { id: 42, trigger: true } }

console.log(routine.request({ id: 42, foo: 'bar' })); 
// { type: 'PREFIX/TRIGGER', payload: { id: 42 } }

console.log(routine.success({ id: 42, data: 'something' })); 
// { type: 'PREFIX/TRIGGER', payload: { id: 42, data: parseData('something') } }

console.log(routine.failure({ id: 42, error: 'oops...' })); 
// { type: 'PREFIX/TRIGGER', payload: { error: true, errorMessage: parseError('oops..') } }

console.log(routine.fulfill({ id: 42, foo: 'bar', baz: 'zab' })); 
// { type: 'PREFIX/TRIGGER', payload: {}} }
```

You may use lower or uppercase for `payloadCreator`-object keys: 

```javascript
const payloadCreator = {
  trigger: () => {}, // lowercase is okay
  REQUEST: () => {}, // uppercase is okay as well
};
```

### Adding or changing action meta with `metaCreator`
`createRoutine` accept third parameter and treat it as `metaCreator`. It works almost the same as `payloadCreator` (function or object is accepted) 
the only difference is it works with `action.meta` instead of `action.payload` parameter:

```javascript
const simpleMetaCreator = () => ({ foo: 'bar' });
const routineWithSimpleMeta = createRoutine('PREFIX', null, simpleMetaCreator);

console.log(routineWithSimpleMeta.trigger()); 
// { type: 'PREFIX/TRIGGER', payload: {}, meta: { foo: 'bar' } }

const complexMetaCreator = {
  trigger: () => ({ trigger: true }),
  request: () => ({ ignoreCache: true }),
  success: () => ({ saveToCache: true }),
  failure: () => ({ logSomewhere: true }),
  fulfill: () => ({ yo: 'bro!' }),
};

const routineWithComplexMeta =  createRoutine('PREFIX', null, complexMetaCreator);
console.log(routineWithSimpleMeta.trigger()); 
// { type: 'PREFIX/TRIGGER', payload: {}, meta: { trigger: true } }

console.log(routineWithSimpleMeta.request()); 
// { type: 'PREFIX/TRIGGER', payload: {}, meta: { ignoreCache: true } }

console.log(routineWithSimpleMeta.success()); 
// { type: 'PREFIX/TRIGGER', payload: {}, meta: { saveToCache: true } }

console.log(routineWithSimpleMeta.failure()); 
// { type: 'PREFIX/TRIGGER', payload: {}, meta: { logSomewhere: true } }

console.log(routineWithSimpleMeta.fulfill()); 
// { type: 'PREFIX/TRIGGER', payload: {}, meta: { yo: 'bro!' } }
```

## Creating your own routines
Sometimes you may need custom routines, so now you are able to create your own routine creator to get them!

```javascript
import { createRoutineCreator } from 'redux-saga-routines';

const createToggleRoutine = createRoutineCreator(['SHOW', 'HIDE', 'TOGGLE']);
console.log(createToggleRoutine.STAGES);
// ['SHOW', 'HIDE', 'TOGGLE']

const myToggler = createToggleRoutine('PREFIX'/*, payloadCreator, metaCreator*/);
console.log(myToggler._STAGES);
// ['SHOW', 'HIDE', 'TOGGLE']

console.log(myToggler._PREFIX);
// 'PREFIX'

console.log(myToggler.SHOW);
// 'PREFIX/SHOW'

console.log(myToggler.HIDE);
// 'PREFIX/HIDE'

console.log(myToggler.TOGGLE);
// 'PREFIX/TOGGLE'

console.log(myToggler.show(payload));
// { type: 'PREFIX/SHOW', payload }

console.log(myToggler.hide(payload));
// { type: 'PREFIX/HIDE', payload }

console.log(myToggler.toggle(payload));
// { type: 'PREFIX/TOGGLE', payload } 
```

So, now you are able to group any actions into custom routine and use it as you want!

`createRoutineCreator` also accepts custom separator as a second parameter, so you are able to change slash `/` with anything you want:

```javascript
import { createRoutineCreator, defaultRoutineStages } from 'redux-saga-routines';

const createUnderscoreRoutine = createRoutineCreator(defaultRoutineStages, '_');
const routine = createUnderscoreRoutine('ACTION_TYPE_PREFIX');

console.log(routine.TRIGGER); 
// 'ACTION_TYPE_PREFIX_TRIGGER';

console.log(routine.REQUEST); 
// 'ACTION_TYPE_PREFIX_REQUEST';

console.log(routine.SUCCESS); 
// 'ACTION_TYPE_PREFIX_SUCCESS';

console.log(routine.FAILURE); 
// 'ACTION_TYPE_PREFIX_FAILURE';

console.log(routine.FULFILL); 
// 'ACTION_TYPE_PREFIX_FULFILL';
```

In example above you may notice, that default routine stages are also exported from the package, so you may use them to create your own extended routine.
Now all the power is in your hands, use it as you want!

## Usage examples
### Example: fetching data from server

Let's start with creating routine for fetching some data from server:
```javascript
// routines.js

import { createRoutine } from 'redux-saga-routines';
export const fetchData = createRoutine('FETCH_DATA');
```

Then, let's create some component, that triggers data fetching:
```javascript
// FetchButton.js

import { connect } from 'react-redux';
import { fetchData } from './routines'; // import our routine

class FetchButton extends React.Component {
  static mapStateToProps = (state) => {
    return {...}; // map some state to component props
  }
  static mapDispatchToProps = {
    fetchData,
  };

  onClick() {
    this.props.fetchData(); // dispatching routine trigger action
  }

  render() {
    return (
      <button onClick={() => this.onClick()}>
        Fetch data from server
      </button>
    );
  }
}

export default connect(FetchButton.mapStateToProps, FetchButton.mapDispatchToProps)(FetchButton);
```

Now, let's take a look at reducer example:
```javascript
// reducer.js

import { fetchData } from './routines';

const initialState = {
  data: null,
  loading: false,
  error: null,
};

export default function exampleReducer(state = initialState, action) {
  switch (action.type) {
    case fetchData.TRIGGER:
      return {
        ...state,
        loading: true,
      };
    case fetchData.SUCCESS:
      return {
        ...state,
        data: action.payload,
      };
    case fetchData.FAILURE:
      return {
        ...state,
        error: action.payload,
      };
    case fetchData.FULFILL:
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
}
```

And, saga (but you can use any other middleware, like `redux-thunk`):
```javascript
// saga.js

import { fetchData } from './routines';

function* requestWatcherSaga() {
  // run fetchDataFromServer on every trigger action
  yield takeEvery(fetchData.TRIGGER, fetchDataFromServer)
}

function* fetchDataFromServer() {
  try {
    // trigger request action
    yield put(fetchData.request());
    // perform request to '/some_url' to fetch some data
    const response = yield call(apiClient.request, '/some_url');
    // if request successfully finished
    yield put(fetchData.success(response.data));
  } catch (error) {
    // if request failed
    yield put(fetchData.failure(error.message));
  } finally {
    // trigger fulfill action
    yield put(fetchData.fulfill());
  }
}
```

### Filtering actions
It is a common case to ignore some triggered actions and not to perform API request every time.
For example, let's make a saga, that perform API request only on odd button clicks (1st, 3rd, 5th, ...):
```javascript
// saga.js

import { fetchData } from './routines';

function* requestWatcherSaga() {
  // run handleTriggerAction on every trigger action
  yield takeEvery(fetchData.TRIGGER, handleTriggerAction)
}

let counter = 0;
function* handleTriggerAction() {
  if (counter++ % 2 === 0) {
    // perform API request only on odd calls
    yield call(fetchDataFromServer);
  }

  // trigger fulfill action to finish routine lifecycle on every click
  yield put(fetchData.fulfill());
}

function* fetchDataFromServer() {
  try {
    // trigger request action
    yield put(fetchData.request());
    // perform request to '/some_url' to fetch some data
    const response = yield call(apiClient.request, '/some_url');
    // if request successfully finished
    yield put(fetchData.success(response.data));
  } catch (error) {
    // if request failed
    yield put(fetchData.failure(error.message));
  }
}
```

### Wrap routine into promise
Sometimes it is useful to use promises (especially with 3rd-party components). With `redux-saga-routines` you are able to wrap your routine into promise and handle it in your saga!
To achive this just add `routinePromiseWatcherSaga` in your `sagaMiddleware.run()`, for example like this:
```javascript
import { routinePromiseWatcherSaga } from 'redux-saga-routines';

const sagas = [
  yourFirstSaga,
  yourOtherSaga,
  // ...,
  routinePromiseWatcherSaga,
];
sagas.forEach((saga) => sagaMiddleware.run(saga));
```

Now we are ready. There is special `promisifyRoutine` helper, that wraps your routine in function with signature: `(payload, dispatch) => Promise`.
See example below:
First, create routine:
```javascript
// routines.js

import { createRoutine, promisifyRoutine } from 'redux-saga-routines';
export const myRoutine = createRoutine('MY_ROUTINE');
export const myRoutinePromiseCreator = promisifyRoutine(myRoutine);
```

Then, use it in your form component:
```javascript
// MyComponent.js
import { bindPromiseCreators } from 'redux-saga-routines';
import { myRoutine, myRoutinePromiseCreator } from './routines';

// since promise creator signature is (values, dispatch) => Promise
// we have to bind it to dispatch using special helper bindPromiseCreator

class MyComponent extends React.Component {
  static mapStateToProps(state) {
    // return props object from selected from state
  }

  static mapDispatchToProps(dispatch) {
    return {
      ...bindPromiseCreators({
        myRoutinePromiseCreator,
        // other promise creators can be here...
      }, dispatch),

      // here you can use bindActionCreators from redux
      // to bind simple action creators
      // ...bindActionCreators({ mySimpleAction1, mySimpleAction2 }, dispatch)

      // or other helpers to bind other functions to store's dispatch
      // ...

      // or just pass dispatch as a prop to component
      dispatch,
    };
  }


  handleClick() {
    const promise = this.props.myRoutinePromiseCreator(somePayload);
    // so, call of myRoutinePromiseCreator returns promise
    // you can use this promise as you want

    promise.then(
      (successPayload) => console.log('success :)', successPayload),
      (failurePayload) => console.log('failure :(', failurePayload),
    );


    // internally when you call myRoutinePromiseCreator() special action with type ROUTINE_PROMISE_ACTION is dispatched
    // this special action is handled by routinePromiseWatcherSaga

    // to resolve promise you need to dispatch myRoutine.success(successPayload) action, successPayload will be passed to resolved promise
    // if  myRoutine.failure(failurePayload) is dispatched, promise will be rejected with failurePayload.

    // we just want to wait 5 seconds and then resolve promise with 'voila!' message:
    setTimeout(
      () => this.props.dispatch(myRoutine.success('voila!')),
      5000,
    );

    // same example, but with promise rejection:
    // setTimeout(
    //   () => this.props.dispatch(myRoutine.failure('something went wrong...')),
    //   5000,
    // );

    // of course you don't have to do it in your component
    // you can do it in your saga
    // see below
  }

  render() {
    return (
      <button onClick={() => this.handleClick()}>
        {/* your form fields here... */}
      </form>
    );
  }
}

export default connect(MyComponent.mapStateToProps, MyComponent.mapDispatchToProps)(MyComponent);
```

You are able to resolve/reject given promise in your saga:
```javascript
// saga.js
import { myRoutine } from './routines';

function* myRoutineTriggerWatcher() {
  // when you call myRoutinePromiseCreator(somePayload)
  // internally myRoutine.trigger(somePayload) action is dispatched
  // we take every routine trigger actions and handle them
  yield takeEvery(myRoutine.TRIGGER, handleTriggerAction)
}

function* handleTriggerAction(action) {
  const { payload } = action; // here payload is somePayload passed from myRoutinePromiseCreator(somePayload)
  const isDataCorrect = verifyData(payload);

  if (isDataCorrect) {
    // send data to server
    yield call(sendFormDataToServer, payload);
  } else {
    // reject given promise
    yield put(myRoutine.failure('something went wrong'));
  }

  // trigger fulfill action to end routine lifecycle
  yield put(myRoutine.fulfill());
}

function* sendFormDataToServer(data) {
  try {
    // trigger request action
    yield put(myRoutine.request());
    // perform request to '/endpoint'
    const response = yield call(apiClient.request, '/endpoint', data);
    // if request successfully finished we resolve promise with response data
    yield put(myRoutine.success(response.data));
  } catch (error) {
    // if request failed we reject promise with error message
    yield put(myRoutine.failure(error.message);
  }
}
```


### `redux-saga`, `redux-form`, `redux-saga-routines` combo
You are also allowed to use combo of `redux-saga`, `redux-form` and `redux-saga-routines`!
Since `redux-form` validation based on promises, you are able to handle `redux-form` validation in your saga.
To achive this just add `routinePromiseWatcherSaga` in your `sagaMiddleware.run()`, like in example above.

There is a special `bindRoutineToReduxForm` helper, that wraps your routine in function with `redux-form` compatible signature: `(values, dispatch, props) => Promise` (it works just like `promisifyRoutine` but more specific to be compatible with full `redux-form` functionality)


First, create routine and it's wrapper for `redux-form`:
```javascript
// routines.js

import { createRoutine, bindRoutineToReduxForm } from 'redux-saga-routines';
export const submitFormRoutine = createRoutine('SUBMIT_MY_FORM');
export const submitFormHandler = bindRoutineToReduxForm(submitFormRoutine);
```

Then, use it in your form component:
```javascript
// MyForm.js

import { reduxForm } from 'redux-form';
import { submitFormHandler } from './routines';

// you do not need to bind your handler to store, since `redux-form` pass `dispatch` to handler.

class MyForm extends React.Component {
  render() {
    return (
      <form onSubmit={this.props.handleSubmit(submitFormHandler)}>
        {/* your form fields here... */}
      </form>
    );
  }
}

export default reduxForm()(MyForm);
```


Now you are able to handle form submission in your saga:
```javascript
// saga.js
import { SubmissionError } from 'redux-form';
import { submitFormRoutine } from './routines';

function* validateFormWatcherSaga() {
  // run validation on every trigger action
  yield takeEvery(submitFormRoutine.TRIGGER, validate)
}

function* validate(action) {
  // redux-form pass form values and component props to submit handler
  // so they passed to trigger action as an action payload
  const { values, props } = action.payload;

  if (!isValid(values, props)) {
    // client-side validation failed
    const errors = getFormErrors(values, props);
    // reject promise given to redux-form, pass errors as SubmissionError object according to redux-form docs
    yield put(submitFormRoutine.failure(new SubmissionError(errors)));
  } else {
    // send form data to server
    yield call(sendFormDataToServer, values);
  }

  // trigger fulfill action to end routine lifecycle
  yield put(submitFormRoutine.fulfill());
}

function* sendFormDataToServer(formData) {
  try {
    // trigger request action
    yield put(submitFormRoutine.request());
    // perform request to '/submit' to send form data
    const response = yield call(apiClient.request, '/submit', formData);
    // if request successfully finished
    yield put(submitFormRoutine.success(response.data));
  } catch (error) {
    // if request failed
    yield put(submitFormRoutine.failure(new SubmissionError({ _error: error.message })));
  }
}
```

## Version 2
Module was totally reworked since version 2.0.0. If you still using version 1.* see [version 1 docs](https://github.com/afitiskin/redux-saga-routines/tree/v1)

## License

MIT

