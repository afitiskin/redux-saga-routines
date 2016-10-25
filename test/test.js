import 'babel-polyfill';
import { PROMISE_ACTION, createAction, actionsWatcherSaga, handleActionSaga } from '../src';
import { takeEvery } from 'redux-saga';
import { take, race, put, call } from 'redux-saga/effects';
import { describe, beforeEach, it } from 'mocha';
import { expect } from 'chai';
import { isFSA } from 'flux-standard-action';

const PREFIX = 'PREFIX';
const REQUEST = `${PREFIX}_REQUEST`;
const SUCCESS = `${PREFIX}_SUCCESS`;
const FAILURE = `${PREFIX}_FAILURE`;

describe('redux-saga-actions', () => {
  describe('createAction', () => {
    ['default', 'short'].forEach(function(type) {
      let formAction, action, dispatch, payload, promise, payloadCreator;
      let beforeFn = () => {
        dispatch = (a) => { action = a };
        payload = { mock: 'payload' };
        promise = formAction(payload, dispatch);
        payloadCreator = key => ({ key });
      };

      describe(`with the ${type} implementation`, function() {
        beforeEach(() => {
          if (type === 'default') {
            formAction = createAction(
              mockCreateLoginRequest(payloadCreator),
              [SUCCESS, FAILURE],
              payloadCreator
            );
          } else {
            formAction = createAction(PREFIX, payloadCreator);
          }

          beforeFn();
        });

        it('should return a promise', () => {
          expect(formAction).to.be.a('function');
          expect(formAction({}).then).to.be.a('function');
        });

        it('should dispatch an FSA compient action', () => {
          expect(isFSA(action)).to.equal(true);
        });

        it('should dispatch an action with the correct structure', () => {
          expect(action.payload).to.have.keys(['defer', 'request', 'types']);
          expect(action.payload.defer).to.have.keys(['reject', 'resolve']);
          expect(action.payload.request).to.have.keys(['payload', 'type']);
          expect(action.payload.types).to.be.an('array');
        });

        it('should dispatch an action with a defer with reject, resolve fns', () => {
          expect(action.payload.defer.reject).to.be.a('function');
          expect(action.payload.defer.resolve).to.be.a('function');
        });

        it('should dispatch an action with the correct request action', () => {
          expect(action.payload.request.payload).to.deep.equal({ key: payload });
          expect(action.payload.request.type).to.equal(REQUEST);
        });

        it('should dispatch an action with the correct types', () => {
          expect(action.payload.types[0]).to.equal(SUCCESS);
          expect(action.payload.types[1]).to.equal(FAILURE);
        });

        it('should return a promise', () => {
          expect(promise).to.be.a('promise');
        });
      });
    });
  });

  describe('actionsWatcherSaga', () => {
    let action, defer, request, types;

    beforeEach(() => {
      request = {
        type: REQUEST,
        payload: {},
      };
      defer = {
        resolve: () => {},
        reject: () => {},
      };
      types = [ SUCCESS, FAILURE ];

      action = {
        type: PROMISE_ACTION,
        payload: {
          defer,
          request,
          types,
        },
      };
    });

    it('should take every PROMISE_ACTION action and run handleActionSaga iterator', function () {
      const iterator = actionsWatcherSaga();

      expect(iterator.next().value).to.deep.equal(
        call(takeEvery, PROMISE_ACTION, handleActionSaga)
      );
      expect(iterator.next().done).to.equal(true);
    });

    describe('handleActionSaga', () => {
      let iterator;

      beforeEach(() => {
        iterator = handleActionSaga(action);
      });

      it('with a successful run it should yield with a TAKE of type FAILURE', () => {
        run({ success: 'A success' });
      });

      it('with a failed run it should yield with a TAKE of type FAILURE', () => {
        run({ failure: 'A failure!' });
      });

      it('with a failed run it should yield with a TAKE of type FAILURE', () => {
        run({ failure: { payload: 'failure payload!' } });
      });

      function run(winner) {
        expect(iterator.next().value).to.deep.equal([
          race({ success: take(SUCCESS), failure: take(FAILURE) }),
          put(request),
        ]);

        const successResult = winner.success;
        const failureResult = winner.failure && winner.failure.payload ? winner.failure.payload : winner.failure;
        const result = winner.success ? call(defer.resolve, successResult) : call(defer.reject, failureResult);

        expect(iterator.next([winner]).value).to.deep.equal(result);
      }
    });
  });
});

function mockCreateLoginRequest(creator) {
  creator = creator || (payload => payload);
  return (data) => ({
    type: REQUEST,
    payload: creator(data),
  })
}
