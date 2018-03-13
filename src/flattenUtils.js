/**
 * This module is a copy of `flattenUtils` module from 'redux-actions'
 * @see https://github.com/redux-utilities/redux-actions/blob/master/src/flattenUtils.js
 */

import camelCase from './camelCase';
import ownKeys from './ownKeys';
import hasGeneratorInterface from './hasGeneratorInterface';
import isPlainObject from 'lodash/isPlainObject';
import isMap from 'lodash/isMap';

export const defaultNamespace = '/';

function get(key, x) {
  return isMap(x) ? x.get(key) : x[key];
}

const flattenWhenNode = predicate => function flatten(
  map,
  {
    namespace = defaultNamespace,
    prefix
  } = {},
  partialFlatMap = {},
  partialFlatActionType = ''
) {
  function connectNamespace(type) {
    return partialFlatActionType
      ? `${partialFlatActionType}${namespace}${type}`
      : type;
  }

  function connectPrefix(type) {
    if (partialFlatActionType || !prefix) {
      return type;
    }

    return `${prefix}${namespace}${type}`;
  }

  ownKeys(map).forEach(type => {
    const nextNamespace = connectPrefix(connectNamespace(type));
    const mapValue = get(type, map);

    if (!predicate(mapValue)) {
      partialFlatMap[nextNamespace] = mapValue;
    } else {
      flatten(mapValue, { namespace, prefix }, partialFlatMap, nextNamespace);
    }
  });

  return partialFlatMap;
};

const flattenActionMap  = flattenWhenNode(isPlainObject);
const flattenReducerMap = flattenWhenNode(
  node => (isPlainObject(node) || isMap(node)) && !hasGeneratorInterface(node)
);

function unflattenActionCreators(
  flatActionCreators,
  {
    namespace = defaultNamespace,
    prefix
  } = {}
) {
  function unflatten(
    flatActionType,
    partialNestedActionCreators = {},
    partialFlatActionTypePath = [],
  ) {
    const nextNamespace = camelCase(partialFlatActionTypePath.shift());
    if (partialFlatActionTypePath.length) {
      if (!partialNestedActionCreators[nextNamespace]) {
        partialNestedActionCreators[nextNamespace] = {};
      }
      unflatten(
        flatActionType, partialNestedActionCreators[nextNamespace], partialFlatActionTypePath
      );
    } else {
      partialNestedActionCreators[nextNamespace] = flatActionCreators[flatActionType];
    }
  }

  const nestedActionCreators = {};
  Object
    .getOwnPropertyNames(flatActionCreators)
    .forEach(type => {
      const unprefixedType = prefix ? type.replace(`${prefix}${namespace}`, '') : type;
      return unflatten(type, nestedActionCreators, unprefixedType.split(namespace));
    });

  return nestedActionCreators;
}

export { flattenActionMap, flattenReducerMap, unflattenActionCreators };
