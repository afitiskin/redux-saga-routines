# redux-saga-routines
A smart action creator for [Redux Saga](https://github.com/yelouafi/redux-saga). Useful for any kind of async actions like fetching data. Also fully compatible with [Redux Form](https://github.com/erikras/redux-form). Reworked idea of [redux-saga-actions](https://github.com/afitiskin/redux-saga-actions)

## Why do I need this?

Reduce boilerplate from your source code when making requests to API or validating forms build on top of [Redux Form](https://github.com/erikras/redux-form).

## Installation

```javascript
yarn add redux-saga-routines
```

**Important!** `redux-saga-routines` uses native *ES2015 Promises*, if the browser you are targeting doesn't support ES2015 Promises, you habe provide a valid polyfill, such as [the one provided by `babel`](https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/6.9.1/polyfill.js).

## What is routine?
Routine is a smart action creator that encapsulates 5 action types and 5 action creators to make standard actions lifecycle easy-to-use:
TRIGGER -> REQUEST -> SUCCESS / FAILURE -> FULFILL

So, with `redux-saga-routines` you don't need to create all these action type constants and action creators manually, just use `createRoutine`:

```javascript
import { createRotine } from 'redux-saga-routines';

// creating routine
const routine = createRoutine('PREFIX');
```

`'PREFIX'` passed to `createRoutine` is a name of routine (and a prefix for all it's action types).

You can access all action types using `TRIGGER`, `REQUEST`, `SUCCESS`, `FAILURE`, `FULFILL` attributes of `routine` object:
```javascript
routine.TRIGGER === 'PREFIX_TRIGGER';
routine.REQUEST === 'PREFIX_REQUEST';
routine.SUCCESS === 'PREFIX_SUCCESS';
routine.FAILURE === 'PREFIX_FAILURE';
routine.FULFILL === 'PREFIX_FULFILL';
```

You also have 5 action creators: `trigger`, `request`, `success`, `failure`, `fulfill`:
```javascript
routine.trigger(payload) === { type: 'PREFIX_TRIGGER', payload };
routine.request(payload) === { type: 'PREFIX_REQUEST', payload };
routine.success(payload) === { type: 'PREFIX_SUCCESS', payload };
routine.failure(payload) === { type: 'PREFIX_FAILURE', payload };
routine.fulfill(payload) === { type: 'PREFIX_FULFILL', payload };
```

Routine by itself is a function, that takes 2 arguments: `payload` and `dispatch` and return Promise:
```javascript
(payload, dispatch) => Promise;
```

Function signature `(payload, dispatch) => Promise` is designed to be compatible with `redux-form` (see example below).

Returned promise will automatically resolved when you trigger `routine.success()` action  and will automatically rejected when `routine.failure()` triggered.
So your `redux-form` validation / submission can be easily and fully controlled in your sagas. 

## Preparation
First of all to enable `redux-saga-routines`, you have to add `routinesWatcherSaga` in your `sagaMiddleware.run()`, for example like this:
```javascript
import { routinesWatcherSaga } from 'redux-saga-routines';

const sagas = [
  yourFirstSaga,
  yourOtherSaga,
  // ..., 
  routinesWatcherSaga,
];
sagas.forEach(sagaMiddleware.run);
```


## Usage
### Example: fetching data from server

Let's start with creating routine for fetching some data from server:
```javascript
// routines.js

import { createRotine } from 'redux-saga-routines';
export const fetchData = createRoutine('FETCH_DATA');
```

Then, let's create some component, that triggers data fetching:
```javascript
// FetchButton.js

import { connect } from 'react-redux';
import { bindRoutineCreators } from 'redux-saga-routines';
import { fetchData } from './routines'; // import our routine

class FetchButton extends React.Component {
  static mapStateToProps = (state) => {
    return {...}; // map some state to component props
  }
  static mapDispatchToProps = (dispatch) => {
    return {
      ...bindRoutineCreators({ fetchData }, dispatch),
      // you can bind other actions as well
      // e.g. using bindActionCreators from 'react-redux':
      // ...bindActionCreators({ action1, action2 }, dispatch),
    }
  };
    
  onClick() {
    this.props.fetchData.trigger(); // dispatching routine trigger action
    // we use `fetchData.trigger()` instead of `fetchData()` to avoid creation of useless Promise
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

And, saga:
```javascript
// saga.js

import { fetchData } from './routines';

function* requestWatcherSaga() {
  // run fetchDataFromServer on every trigger action
  yield takeEvery(fetchData.TRIGGER, fetchDataFromServer)
}

function fetchDataFromServer() {
  try {
    // trigger request action
    yield put(fetchData.request());
    // perform request to '/some_url' to fetch some data
    const response = yield call(apiClient.request, '/some_url');
    // if request successfully finished
    yield put(fetchData.success(response.data));
  } catch (error) {
    // if request failed
    yield put(fetchData.failure(response.error));
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
    yield put(fetchData.failure(response.error));
  }
}
```

### Using with redux-form
`redux-saga-routines` is also useful when you want use `redux-form` with `redux-saga`. Routine signature `(payload, dispatch) => Promise` is fully compatible and designed for `redux-form`.

It is super easy, all you need to do is pass your routine to `handleSubmit` like this `<form onSubmit={handleSubmit(routine)} ...>`

First, create routine:
```javascript
// routines.js

import { createRoutine } from 'redux-saga-routines';
export const submitMyForm = createRoutine('SUBMIT_MY_FORM');
```

Then, use it in your form component:
```javascript
// MyForm.js

import { reduxForm } from 'redux-form';
import { submitMyForm } from './routines'; 

class MyForm extends React.Component {
  render() {
    return (
      <form onSubmit={this.props.handleSubmit(submitMyForm)}>
        {/* your form fields here... */}
      </form>
    );
  }
}

export default reduxForm()(MyForm);
```


And handle form submission in your saga:
```javascript
// saga.js

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
    yield put(submitMyForm.failure(response.error));
  }  
}
```


## License

MIT

