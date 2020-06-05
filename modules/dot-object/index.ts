function isObj(value): boolean {
  const type = typeof value;
  return value !== null && (type === 'object' || type === 'function');
}

function isSet(obj) {
  if (undefined == obj) return false
  return true;
}

function isEmpty(obj) {
  if (undefined == obj) return true
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop))
      return false;
  }
  return JSON.stringify(obj) === JSON.stringify({});
}

function getPathSegments(path) : string[] {
	const pathArray = path.split('.');
	const parts = [];

	for (let i = 0; i < pathArray.length; i++) {
    let p = pathArray[i];    

		while (p[p.length - 1] === '\\' && pathArray[i + 1] !== undefined) {
      p = p.slice(0, -1) + '.';
			p += pathArray[++i];
		}

		parts.push(p);
	}

  const disallowedKeys = [
    '__proto__',
    'prototype',
    'constructor'
  ];
  
  const isValidPath = pathSegments => !pathSegments.some(segment => disallowedKeys.includes(segment));
  
	if (!isValidPath(parts)) {
		return [];
	}

	return parts;
}



function get(object, path, value?) {
  if (!isObj(object) || typeof path !== 'string') {
    return value === undefined ? object : value;
  }

  const pathArray = getPathSegments(path);
  if (pathArray.length === 0) {
    return;
  }

  return getArrayValue(object, pathArray, value)
}


// function get(object, path, value?) : any {
//   path = getPathSegments(path)
//   return getValue(object, path, value)
// }

/*
 * const lines = {
    one: {
      time: '10:00:00',
      user: 'User1',
      content: 'Line1',
    }
  };
  getValue(lines, ['one', 'time'], defaultValue)
*/
function getArrayValue(obj, props = [], defaultValue = null) {
  if (undefined == obj || isEmpty(obj)) return defaultValue

  props.forEach(element => {
    // console.log(element, obj)
    if (undefined == obj || isEmpty(obj) || !obj.hasOwnProperty(element)) {
      obj = defaultValue
      return
    }
    obj = obj[element];
  });

  return obj
}

export default {
  isObj,
  isSet,
  isEmpty,
  getArrayValue, 
  get
}