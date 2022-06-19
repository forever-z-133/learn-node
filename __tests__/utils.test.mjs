import {
  typeOf,
  isNumberString,
  addZero,
  sleep,
  divideArray,
  stringToObject,
  objectToString,
  addDataToUrl,
  camelize,
  camelizeKeys,
  getPureUrl,
  forEachAsync,
  jsonToObject,
} from '../utils/index.mjs';

jest.useFakeTimers();

describe('utils/index.mjs', () => {
  test('typeOf', () => {
    expect(typeOf()).toBe('undefined');
    expect(typeOf(0)).toBe('number');
    expect(typeOf('')).toBe('string');
    expect(typeOf(true)).toBe('boolean');
    expect(typeOf([])).toBe('array');
    expect(typeOf({})).toBe('object');
    expect(typeOf(test)).toBe('function');
    expect(typeOf(() => {})).toBe('function');
    expect(typeOf(/x/)).toBe('regexp');
    expect(typeOf(new Date)).toBe('date');
  });

  test('isNumberString', () => {
    expect(isNumberString()).toBe(false);
    expect(isNumberString('')).toBe(false);
    expect(isNumberString('1x')).toBe(false);
    expect(isNumberString('x1')).toBe(false);
    expect(isNumberString('12')).toBe(true);
  });

  test('addZero', () => {
    expect(addZero()).toBe('00');
    expect(addZero(0)).toBe('00');
    expect(addZero(10)).toBe('10');
    expect(addZero(120)).toBe('120');
    expect(addZero(10, 4)).toBe('0010');
  });

  test('sleep', () => {
    const callback = jest.fn();
    sleep(1000, callback);
    expect(callback).not.toBeCalled();
    jest.advanceTimersByTime(1000);
    expect(callback).toBeCalled();
    expect(callback).toHaveBeenCalledTimes(1);
  });

  test('divideArray', () => {
    const array = [1, 2, 3, 4, 5];
    const result1 = [1, 2];
    const result2 = [3, 4, 5];
    const forEachCallback = item => item < 3;
    const [r1, r2] = divideArray(array, forEachCallback);
    expect(divideArray(array)).toStrictEqual([[], []]);
    expect(r1).toStrictEqual(result1);
    expect(r2).toStrictEqual(result2);
  });

  test('stringToObject', () => {
    expect(stringToObject('')).toStrictEqual({});
    expect(stringToObject('a=1')).toStrictEqual({a:'1'});
    expect(stringToObject('a=1&b=2')).toStrictEqual({a:'1',b:'2'});
    expect(stringToObject('a=&b=2')).toStrictEqual({a:'',b:'2'});
    expect(stringToObject('a=undefined&b=2')).toStrictEqual({a:undefined,b:'2'});
    expect(stringToObject('a=null&b=2')).toStrictEqual({a:undefined,b:'2'});
    expect(stringToObject('a=true&b=2')).toStrictEqual({a:true,b:'2'});
    expect(stringToObject('a=false&b=2')).toStrictEqual({a:false,b:'2'});
    expect(stringToObject('a:1;b:2',';',':')).toStrictEqual({a:'1',b:'2'});
    expect(stringToObject('a=1=1&b=2')).toStrictEqual({a:'1=1',b:'2'});
    expect(stringToObject('&b=2')).toStrictEqual({b:'2'});
    expect(stringToObject('=1&b=2')).toStrictEqual({b:'2'});
  });

  test('objectToString', () => {
    expect(objectToString()).toStrictEqual('');
    expect(objectToString({})).toStrictEqual('');
    expect(objectToString({a:1})).toStrictEqual('a=1');
    expect(objectToString({a:1,b:2})).toStrictEqual('a=1&b=2');
    expect(objectToString({a:null,b:true})).toStrictEqual('a=null&b=true');
  });

  test('addDataToUrl', () => {
    expect(addDataToUrl('index.html')).toStrictEqual('index.html');
    expect(addDataToUrl('index.html?')).toStrictEqual('index.html');
    expect(addDataToUrl('index.html#')).toStrictEqual('index.html');
    expect(addDataToUrl('index.html', 'a=1')).toStrictEqual('index.html?a=1');
    expect(addDataToUrl('index.html', { a: 1 })).toStrictEqual('index.html?a=1');
    expect(addDataToUrl('index.html?x=0', 'a=1')).toStrictEqual('index.html?x=0&a=1');
    expect(addDataToUrl('index.html?x=0', { a: 1 })).toStrictEqual('index.html?x=0&a=1');
    expect(addDataToUrl('index.html', 1000)).toStrictEqual('index.html');
  });

  test('camelize', () => {
    expect(camelize()).toBe('');
    expect(camelize('abc')).toBe('abc');
    expect(camelize('font-')).toBe('font-');
    expect(camelize('font-size')).toBe('fontSize');
  });

  test('camelizeKeys', () => {
    expect(camelizeKeys()).toStrictEqual({});
    expect(camelizeKeys({'font-size':'10px'})).toStrictEqual({'fontSize':'10px'});
  });

  test('getPureUrl', () => {
    expect(getPureUrl()).toBe('');
    expect(getPureUrl('index.html')).toBe('index.html');
    expect(getPureUrl('index.html?x=1')).toBe('index.html');
    expect(getPureUrl('index.html#hash')).toBe('index.html');
    expect(getPureUrl('index.html?x=1#hash')).toBe('index.html');
    expect(getPureUrl('index.html?#hash')).toBe('index.html');
  });

  test('forEachAsync', () => {
    const callback = jest.fn();
    const count = 10;
    const array = new Array(count).fill();
    const result = array.slice(0).map((_, i) => i);
    const forEachCallback = (_, index, next) => {
      setTimeout(() => {
        callback && callback();
        next(index);
      }, Math.random() * 200);
    };
    expect(callback).not.toBeCalled();
    forEachAsync(array, forEachCallback).then(res => {
      expect(res).toStrictEqual(result);
      expect(callback).toHaveBeenCalledTimes(count);
    });
    jest.runOnlyPendingTimers();
    expect(callback).toBeCalled();
    jest.runAllTimers();
  });

  test('jsonToObject', () => {
    expect(jsonToObject(['a','b'])).toStrictEqual({'a':0,'b':1});
    expect(jsonToObject([{name:'a'},{name:'b'}], 'name')).toStrictEqual({'a':{name:'a'},'b':{name:'b'}});
  });
});
