### isObject
```js
  import dotObject from '@khanakiajs/dot-object'

  dotObject.isObject({foo: 'bar'});
  //=> true

  dotObject.isObject([1, 2, 3]);
  //=> true

  dotObject.isObject('foo');
  //=> false
```