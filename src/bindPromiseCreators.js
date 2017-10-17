export function bindPromiseCreator(promiseCreator, dispatch) {
  return (payload) => promiseCreator(payload, dispatch);
}

export default function bindPromiseCreators(promiseCreators, dispatch) {
  if (typeof promiseCreators === 'function') {
    return bindPromiseCreator(promiseCreators, dispatch);
  }

  if (typeof promiseCreators !== 'object' || promiseCreators === null) {
    throw new Error(
      `bindPromiseCreators expected an object or a function, instead received ${promiseCreators === null ? 'null' : typeof promiseCreators}. `
    );
  }

  const keys = Object.keys(promiseCreators);
  const boundPromiseCreators = {};
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const promiseCreator = promiseCreators[key];
    if (typeof promiseCreator === 'function') {
      boundPromiseCreators[key] = bindPromiseCreator(promiseCreator, dispatch);
    }
  }
  return boundPromiseCreators;
}
