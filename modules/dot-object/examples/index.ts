import dotObject from '@khanakiajs/dot-object'


// console.log(dotObject.isObj({foo: 'bar'})==true)
// //=> true

// console.log(dotObject.isObj([1, 2, 3])==true)
// //=> true

// console.log(dotObject.isObj('foo') == false)
// //=> false

// console.log(dotObject.isEmpty({foo: 'bar'})==false);
// //=> false

// console.log(dotObject.isEmpty(undefined)==true);
// //=> true

// console.log(dotObject.isEmpty({})==true);
// // true

const student = {
  name: 'Test',
  class: {
    rank: 1
  }
}

console.log('Student', student)

console.log(`dotObject.get(student, 'student.name')`, dotObject.get(student, 'name'));
//=> Test

console.log(`dotObject.get(student, 'class.rank')`, dotObject.get(student, 'class.rank'));
//=> 1

console.log(`dotObject.get(student, 'class.test', 'defalut')`, dotObject.get(student, 'class.test', 'defalut'));
//=> default

console.log(`dotObject.get(student, 'class.test')`, dotObject.get(student, 'class.test'));
//=> null

console.log(`dotObject.getArrayValue(student, ['name'])`, dotObject.getArrayValue(student, ['name']));
//=> Test

console.log(`dotObject.getArrayValue(student, ['class', 'rank'])`, dotObject.getArrayValue(student, ['class', 'rank']));
//=> 1

console.log(`dotObject.getArrayValue(student, ['class', 'test'], 'defalut')`, dotObject.getArrayValue(student, ['class', 'test'], 'defalut'));
//=> default

console.log(`dotObject.getArrayValue(student, ['class', 'test'])`, dotObject.getArrayValue(student, ['class', 'test']));
//=> null