import 'babel-polyfill';
import { PROMISE, createFormAction, formActionWatcher, handlePromiseSaga, parseResponseSaga } from '../lib';
import { takeEvery } from 'redux-saga';
import { take, race, put, call, fork } from 'redux-saga/effects';
import { expect } from 'chai';
import { isFSA } from 'flux-standard-action';

const PREFIX = 'PREFIX';
const REQUEST = `${PREFIX}_REQUEST`;
const SUCCESS = `${PREFIX}_SUCCESS`;
const FAILURE = `${PREFIX}_FAILURE`;

describe('redux-form-saga', () => {
  describe('createFormAction', () => {
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
            formAction = createFormAction(
              mockCreateLoginRequest(payloadCreator),
              [SUCCESS, FAILURE],
              payloadCreator
            );
          } else {
            formAction = createFormAction(PREFIX, payloadCreator);
          }

          beforeFn();
        })

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

  describe('formActionSaga', () => {
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
        type: PROMISE,
        payload: {
          defer,
          request,
          types
        },
      };
    });

    describe('formActionWather', () => {
      it('should take every PROMISE action and run handlePromise iterator', function () {
        const iterator = formActionWatcher();

        expect(iterator.next().value).to.deep.equal(
          call(takeEvery, PROMISE, handlePromiseSaga)
        );
      });
    });

    describe('handlePromiseSaga', () => {
      it('should properly handle promise action', () => {
        const iterator = handlePromiseSaga(action);

        expect(iterator.next().value).to.deep.equal(
          fork(parseResponseSaga, { defer, types })
        );
        expect(iterator.next().value).to.deep.equal(
          put(request)
        );
      });
    });

    describe('parseResponseSaga', () => {
      let iterator;

      beforeEach(() => {
        iterator = parseResponseSaga({ defer, types});
      });

      it('with a successful run it should yield with a TAKE of type FAILURE', () => {
        run({ success: 'A success' });
      });

      it('with a failed run it should yield with a TAKE of type FAILURE', () => {
        run({ fail: 'A failure!' });
      });

      function run(winner) {
        expect(iterator.next().value).to.deep.equal(
          race({ success: take(SUCCESS), fail: take(FAILURE) })
        );

        if (winner.success) {
          expect(iterator.next(winner).value).to.deep.equal(
            call(defer.resolve, winner.success)
          );
        } else {
          expect(iterator.next(winner).value).to.deep.equal(
            call(defer.reject, winner.fail)
          );
        }
      }
    });
  });
});

function mockCreateLoginRequest(creator) {
  creator = creator || (ident => ident);
  return (data) => ({
    type: REQUEST,
    payload: creator(data)
  })
}
