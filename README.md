# redux-saga-routines
A smart action creator for [Redux](https://github.com/reactjs/redux). Useful for any kind of async actions like fetching data.
Also fully compatible with [Redux Saga](https://github.com/yelouafi/redux-saga) and [Redux Form](https://github.com/erikras/redux-form).

## Version 2
Module was totally reworked since version 2.0.0. If you still using version 1.* see [version 1 docs](https://github.com/afitiskin/redux-saga-routines/tree/v1)

## Why do I need this?

Reduce boilerplate from your source code when making requests to API or validating forms build on top of [Redux Form](https://github.com/erikras/redux-form).

## Installation

```javascript
yarn add redux-saga-routines
```

## What is routine?
Routine is a smart action creator that encapsulates 5 action types and 5 action creators to make standard actions lifecycle easy-to-use:
TRIGGER -> REQUEST -> SUCCESS / FAILURE -> FULFILL

So, with `redux-saga-routines` you don't need to create all these action type constants and action creators manually, just use `createRoutine`:

```javascript
import { createRoutine } from 'redux-saga-routines';

// creating routine
const routine = createRoutine('ACTION_TYPE_PREFIX');
```

`'ACTION_TYPE_PREFIX'` passed to `createRoutine` is a name of routine (and a prefix for all it's action types).

You can access all action types using `TRIGGER`, `REQUEST`, `SUCCESS`, `FAILURE`, `FULFILL` attributes of `routine` object:
```javascript
routine.TRIGGER === 'ACTION_TYPE_PREFIX/TRIGGER';
routine.REQUEST === 'ACTION_TYPE_PREFIX/REQUEST';
routine.SUCCESS === 'ACTION_TYPE_PREFIX/SUCCESS';
routine.FAILURE === 'ACTION_TYPE_PREFIX/FAILURE';
routine.FULFILL === 'ACTION_TYPE_PREFIX/FULFILL';
```

You also have 5 action creators: `trigger`, `request`, `success`, `failure`, `fulfill`:
```javascript
routine.trigger(payload) === { type: 'ACTION_TYPE_PREFIX/TRIGGER', payload };
routine.request(payload) === { type: 'ACTION_TYPE_PREFIX/REQUEST', payload };
routine.success(payload) === { type: 'ACTION_TYPE_PREFIX/SUCCESS', payload };
routine.failure(payload) === { type: 'ACTION_TYPE_PREFIX/FAILURE', payload };
routine.fulfill(payload) === { type: 'ACTION_TYPE_PREFIX/FULFILL', payload };
```

Routine by itself is a trigger action creator function:
```javascript
expect(routine(payload)).to.deep.equal(routine.trigger(payload));
```

`redux-saga-routines` based on [redux-actions](https://github.com/reduxactions/redux-actions), so `createRoutine` actually accepts 3 parameters: `(actionTypePrefix, payloadCreator, metaCreator) => function`.
Every routine action creator is a  `redux-actions` FSA, so you can use them with `handleAction(s)` or `combineActions` from `redux-actions`

## Usage
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

### `redux-saga`, `redux-form`, `redux-saga-routines` combo
If you want to use combo of `redux-saga`, `redux-form` and `redux-saga-routines`, you have to prepare a bit.
Since `redux-form` validation based on promises, we have to handle special action type to make it possible to handle `redux-form` validation in your saga.
To achive this just add `routinePromiseWatcherSaga` in your `sagaMiddleware.run()`, for example like this:
```javascript
import { routinePromiseWatcherSaga } from 'redux-saga-routines';

const sagas = [
  yourFirstSaga,
  yourOtherSaga,
  // ...,
  routinePromiseWatcherSaga,
];
sagas.forEach(sagaMiddleware.run);
```

Now we are ready. There are special `bindRoutineToReduxForm` helper, that wraps your routine in function with `redux-form` compatible signature: `(values, dispatch, props) => Promise`.
See example below:

First, create routine:
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
import { submitMyForm } from './routines';

function* validateFormWatcherSaga() {
  // run validation on every trigger action
  yield takeEvery(submitMyForm.TRIGGER, validate)
}

function* validate(action) {
  const formData = action.payload;

  if (!isValid(formData)) {
    // client-side validation failed
    const errors = getFormErrors(formData);
    yield put(submitMyForm.failure(new SubmissionError(errors)));
  } else {
    // send form data to server
    yield call(sendFormDataToServer, formData);
  }

  // trigger fulfill action to end routine lifecycle
  yield put(submitMyForm.fulfill());
}

function* sendFormDataToServer(formData) {
  try {
    // trigger request action
    yield put(submitMyForm.request());
    // perform request to '/submit' to send form data
    const response = yield call(apiClient.request, '/submit', formData);
    // if request successfully finished
    yield put(submitMyForm.success(response.data));
  } catch (error) {
    // if request failed
    yield put(submitMyForm.failure(new SubmissionError({ _error: error.message })));
  }
}
```


## License

MIT

