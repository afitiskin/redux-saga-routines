/**
 * This module is a copy of `hasGeneratorInterface` module from 'redux-actions'
 * @see https://github.com/redux-utilities/redux-actions/blob/master/src/hasGeneratorInterface.js
 */

import ownKeys from './ownKeys';

export default function hasGeneratorInterface(handler) {
  const keys = ownKeys(handler);
  const hasOnlyInterfaceNames = keys.every((ownKey) => ownKey === 'next' || ownKey === 'throw');
  return (keys.length && keys.length <= 2 && hasOnlyInterfaceNames);
}
