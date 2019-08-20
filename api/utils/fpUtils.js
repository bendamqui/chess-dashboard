const functor = value => ({
  value: () => value,
  map: fn => functor(fn(value)),
  mapAsync: async fn => functor(await fn(value))
});

const map = (...fns) => {
  return functor => {
    const result = fns.reduce((acc, fn) => {
      return acc.map(fn);
    }, functor);
    return Array.isArray(result) ? result : result.value();
  };
};

// @todo write test before using.
const mapAsync = (...fns) => {
  return async functor => {
    const result = await fns.reduce((promise, fn) => {
      return promise.then(async acc => {
        return (await Array.isArray(acc))
          ? Promise.all(acc.map(fn))
          : acc.mapAsync(fn);
      });
    }, Promise.resolve(functor));
    return Array.isArray(result) ? result : result.value();
  };
};

module.exports.functor = functor;
module.exports.map = map;
