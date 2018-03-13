/**
 * This module is a copy of `arrayToObject` module from 'redux-actions'
 * @see https://github.com/redux-utilities/redux-actions/blob/master/src/arrayToObject.js
 */

export default (array, callback) => array.reduce(
  (partialObject, element) => callback(partialObject, element),
  {}
);
