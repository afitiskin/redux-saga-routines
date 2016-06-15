# redux-form-saga
Connecting [Redux Form](https://github.com/erikras/redux-form) and [Redux Saga](https://github.com/yelouafi/redux-saga) through a saga.

[![Build Status](https://travis-ci.org/mhssmnn/redux-form-saga.svg)](https://travis-ci.org/mhssmnn/redux-form-saga) [![npm version](https://badge.fury.io/js/redux-form-saga.svg)](http://badge.fury.io/js/redux-form-saga)

```javascript
npm install --save redux-form-saga
```

## Why do I need this?

If you are using Redux Saga and have tried to get Redux Form to play along, then you likely know it doesn't quite work. This provides a solution using an action creator `createFormAction('REQUEST')` and a saga `formActionSaga`.

## Installation

```javascript
npm i --save redux-form-saga
```

Then, to enable Redux Form Saga, add `formActionSaga` in your `sagaMiddleware.run()`.

## Usage

Any form you create using Redux Form can receive an action creator (i.e. `requestAction`) as a parameter to `handleSubmit`.

```javascript
import { createAction } from 'redux-actions';
import { createFormAction } from 'redux-form-saga';

const typePrefix = 'FORM';
const formAction = createFormAction(typePrefix);

// formAction.REQUEST == 'FORM_REQUEST';
// formAction.SUCCESS == 'FORM_SUCCESS';
// formAction.FAILURE == 'FORM_FAILURE';
// formAction.request(payload) == { type: 'FORM_REQUEST', payload };
// formAction.success(payload) == { type: 'FORM_SUCCESS', payload };
// formAction.failure(payload) == { type: 'FORM_FAILURE', payload };

<form onSubmit={handleSubmit(formAction)}>
// ...
</form>
```

or long form

```javascript
import { createAction } from 'redux-actions';
import { createFormAction } from 'redux-form-saga';

const REQUEST = 'REQUEST';
const SUCCESS = 'SUCCESS';
const FAILURE = 'FAILURE';

const requestAction = createAction(REQUEST);
const successAction = createAction(SUCCESS);
const failureAction = createAction(FAILURE);

const formAction = createFormAction(requestAction, [SUCCESS, FAILURE]);

// ...

<form onSubmit={handleSubmit(formAction)}>
// ...
</form>
```

Now you can create a saga to handle the request, success and failure flow and this will be sent back to the form component.

For example, a login form saga:

```javascript
import { push } from 'react-router-redux';
import { take, put, call } from 'redux-saga/effects';
import { auth } from '...';
import { LOGIN_REQUEST, loginSuccess, loginFailure } from '...';

/**
 * Authentication saga
 */
export function *loginFlow () {
  while (true) {
    let request = yield take(LOGIN_REQUEST);
    let user = ({ username, password } = request.payload);
    let token;

    try {
      token = yield call(auth.login, { user });
      yield put(loginSuccess(token));
    } catch (error) {
      yield put(loginFailure(error));
    }
  }
}
```

## Scripts

```
$ npm run test
```

## License

MIT

