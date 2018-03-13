/**
 * This module is a copy of `ownKeys` module from 'redux-actions'
 * @see https://github.com/redux-utilities/redux-actions/blob/master/src/ownKeys.js
 */

import isMap from 'lodash/isMap';

export default function ownKeys(object) {

  if (isMap(object)) {
    return Array.from(object.keys());
  }

  if (typeof Reflect !== 'undefined' && typeof Reflect.ownKeys === 'function') {
    return Reflect.ownKeys(object);
  }

  let keys = Object.getOwnPropertyNames(object);

  if (typeof Object.getOwnPropertySymbols === 'function') {
    keys = keys.concat(Object.getOwnPropertySymbols(object));
  }

  return keys;
}
