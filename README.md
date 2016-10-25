# redux-saga-actions
An action creator for [Redux Saga](https://github.com/yelouafi/redux-saga) compatible with [Redux Form](https://github.com/erikras/redux-form). Forked from [redux-form-saga](https://github.com/mhssmnn/redux-form-saga)



## Why do I need this?

Reduce boilerplate from your source code when making requests to API or validate forms build on top of Redux Form.

## Installation

```javascript
npm install --save redux-saga-actions
```

Then, to enable redux-saga-actions, add `actionsWatcherSaga` in your `sagaMiddleware.run()`.

**Important!** If the browser you are targeting doesn't support *ES2015 promises*, you must provide a valid polyfill, such as [the one provided by `babel`](https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/6.9.1/polyfill.js).

## Usage

```javascript
import { createAction } from 'redux-saga-actions';

// create action
const action = createAction('FETCH_DATA');

// now your action is a function that returns promise (useful for Redux Form users)
// action == (payload, dispatch) => Promise

// also, you have access to sub action types constants:
// action.REQUEST == 'FETCH_DATA_REQUEST';
// action.SUCCESS == 'FETCH_DATA_SUCCESS';
// action.FAILURE == 'FETCH_DATA_FAILURE';

// and to of sub actions creators:
// action.request(payload) == { type: 'FETCH_DATA_REQUEST', payload };
// action.success(payload) == { type: 'FETCH_DATA_SUCCESS', payload };
// action.failure(payload) == { type: 'FETCH_DATA_FAILURE', payload };


// when you want to initialize data fetching, you need only to call action:
action(payload, dispatch);

// then, you need to handle action.REQUEST action in your own saga to perform API request:
function handleRequest() {
  try {
    // perform request to '/some_url' to fetch some data
    const response = yield call(apiClient.request, '/some_url');
    // if request successfully finished
    yield put(action.success(response.data));
  } catch (error) {
    // if request failed
    yield put(action.failure(response.error));
  }
}

function* handleRequestSaga() {
  yield takeEvery(action.REQUEST, handleRequest)
}
```


Result of `action(payload, dispatch)` is a Promise, so you can directly pass this function to Redux Form's `handleSubmit` to perform async validation:
```javascript
<form onSubmit={handleSubmit(action)}>...</form>
```

To properly handle form errors you have to pass to `action.failure` instance of `SubmissionError`:
```javascript
yield put(action.failure(new SubmissionError(response.error)));
```


## Scripts

```
$ npm run test
```

## License

MIT

