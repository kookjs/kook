<p align="center">
  <a href="https://kook.khanakia.com/" target="blank"><img src="https://avatars2.githubusercontent.com/u/66347265?s=400&u=b1b91a259fdc55c20a14b18b144ca6af4ed33931&v=4" width="70" alt="Kook Js Logo" /></a>
</p>


[![Node.js CI](https://github.com/node-cache/node-cache/workflows/Node.js%20CI/badge.svg?branch=master)](https://github.com/node-cache/node-cache/actions?query=workflow%3A%22Node.js+CI%22+branch%3A%22master%22)
![Dependency status](https://img.shields.io/david/node-cache/node-cache)


### Dot-Object makes it possible to transform javascript objects using dot notation or array of strings.

Check examples directory [examples](https://github.com/kookjs/kook/tree/master/modules/dot-object/examples)


## API
## isObj
Test if variable is object or not
@Returns Boolan (TRUE | FALSE)
```js
  import dotObject from '@khanakiajs/dot-object'

  dotObject.isObj({foo: 'bar'});
  //=> true

  dotObject.isObj([1, 2, 3]);
  //=> true

  dotObject.isObj('foo');
  //=> false
```

## isEmpty
Test if object is undefined or empty
@Returns Boolan (TRUE | FALSE)
```js
  import dotObject from '@khanakiajs/dot-object'

  dotObject.isEmpty({foo: 'bar'});
  //=> false

  dotObject.isEmpty(undefined);
  //=> true

  dotObject.isEmpty({});
  //=> true
```

## getPathSegments
Convert dot notation to the array of strings
@Returns string[]
```js
  import dotObject from '@khanakiajs/dot-object'

  dotObject.getPathSegments('app.name');
  //=> ['app', 'name']
```

## get
Parse object values out of dot notation string if value not find the it will returns defalut value.
@Returns any
```js
  import dotObject from '@khanakiajs/dot-object'
  const student = {
    name: 'Test',
    class: {
      rank: 1
    }
  }
  
  dotObject.get(student, 'name');
  //=> Test

  dotObject.get(student, 'class.rank');
  //=> 1

  dotObject.get(student, 'class.test', 'defalut');
  //=> default

  dotObject.get(student, 'class.test');
  //=> null
```


## getArrayValue
Parse object values out of string array if value not find the it will returns defalut value.
@Returns any
```js
  import dotObject from '@khanakiajs/dot-object'
  const student = {
    name: 'Test',
    class: {
      rank: 1
    }
  }
  
  dotObject.getArrayValue(student, ['name']);
  //=> Test

  dotObject.getArrayValue(student, ['class', 'rank']);
  //=> 1

  dotObject.getArrayValue(student, ['class', 'test'], 'defalut');
  //=> default

  dotObject.getArrayValue(student, ['class', 'test']);
  //=> null
```


## Contribute

If you would like to contribute to the project, please fork it and send us a pull request.  Please add tests
for any new features or bug fixes.

## Stay in touch

* Author - [Aman Khanakia](https://twitter.com/mrkhanakia)
* Website - [https://kook.khanakia.com](https://kook.khanakia.com/)

## License

Cache RDBMS is [MIT licensed](LICENSE).
