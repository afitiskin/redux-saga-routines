export const isFunction = (value) => typeof value === 'function';
export const toCamelCase = (value) => String(value).toLowerCase().replace(/_+(\w)/g, (_, p1) => p1.toUpperCase());
export const toUpperCase = (value) => String(value).toUpperCase();
export const toLowerCase = (value) => String(value).toLowerCase();
export const getCreatorForType = (type, creator) => {
  if (!creator) {
    return creator;
  }

  if (isFunction(creator[type])) {
    return creator[type];
  }
  if (isFunction(creator[toLowerCase(type)])) {
    return creator[toLowerCase(type)];
  }
  if (isFunction(creator[toUpperCase(type)])) {
    return creator[toUpperCase(type)];
  }
  if (isFunction(creator[toCamelCase(type)])) {
    return creator[toCamelCase(type)];
  }
  if (isFunction(creator)) {
    return creator;
  }
  return undefined;
};
