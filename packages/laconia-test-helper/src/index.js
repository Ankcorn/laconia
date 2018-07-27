const _ = require("lodash");

const yields = arg => (params, callback) => callback(null, arg);

const s3Body = object =>
  yields({
    Body: {
      toString: () => JSON.stringify(object)
    }
  });

const reduceNexts = async (reader, times, startingCursor, callback) => {
  await _.range(times).reduce(async (cursorPromise, index) => {
    const cursor = await cursorPromise;
    const next = await reader.next(cursor);
    callback(next, index);
    return next.cursor;
  }, startingCursor);
};

const collectNexts = async (reader, times, startingCursor) => {
  let nexts = [];
  await reduceNexts(reader, times, startingCursor, next => nexts.push(next));
  return nexts;
};

const getTimestampGaps = jestFn => {
  const timestamps = jestFn.mock.timestamps;
  return timestamps.slice(1).map((val, index) => val - timestamps[index]);
};

const matchers = {
  toBeCalledWithGapBetween(jestFn, minimum, maximum) {
    const gaps = getTimestampGaps(jestFn);
    gaps.forEach(gap => {
      expect(gap).toBeGreaterThanOrEqual(minimum);
      expect(gap).toBeLessThanOrEqual(maximum);
    });
    return { pass: true };
  }
};

module.exports.yields = yields;
module.exports.s3Body = s3Body;
module.exports.collectNexts = collectNexts;
module.exports.reduceNexts = reduceNexts;
module.exports.matchers = matchers;
