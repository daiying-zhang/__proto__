/**
 * 遍历对象的属性，包括原型属性
 */
var obj = {};
obj.a = {
    'a1' : 'a',
    'b1' : {
        'aa' : 'aa',
        'bb' : {
            'aaa' : 'aaa',
            'ccc' : [1, 2, 3]
        }
    }
}
obj.b = 'b';
obj.c = [1, 2, 3, 4];

function getProps(obj, isProto){
    return typeof obj === 'object'
                  // 如果是__proto__用getOwnPropertyNames获取不可枚举的属性名称
                  // 否则获取自身可枚举属性名称
                  ? isProto
                        ? Object.getOwnPropertyNames(obj)
                        : Object.keys(obj)
                  : []
}

function type(obj){
    return typeof obj
}

function proto(obj, isProto, name, prex){
    var keys, curr, currPrex, len;

    prex = prex || '';
    // 如果prex===''(第一级)显示为: |--
    // 否则显示为: |    |--,空格个数根据级别增加
    currPrex = '|' + prex + (prex === '' ? '--' : '|--');

    if(!obj){
        // 如果obj为null,返回
        console.log(currPrex + 'null');
        return
    }

    keys = getProps(obj, isProto);
    //如果没有__proto__属性，加入数组遍历__proto__
    !~keys.indexOf('__proto__') && keys.push('__proto__');
    len = keys.length;

    keys.forEach(function(ele, idx, all){

        console.log(currPrex + ele)
        if(type(curr = obj[ele]) === 'object'){
            // 递归处理对象
            // 如果第一级增加两个个空格， 最后一级增加三个空格，其他增加'|  '
            proto(curr, ele === '__proto__', ele, prex + (prex === '' ? '  ' : (idx === len - 1 ? '   ' : '|  ')))
        }
    })
}

console.log('rootObj:')
proto(obj, 'rootObj', '');

// rootObj:
// |--a
// |  |--a1
// |  |--b1
// |  |  |--aa
// |  |  |--bb
// |  |  |  |--aaa
// |  |  |  |--ccc
// |  |  |  |  |--0
// |  |  |  |  |--1
// |  |  |  |  |--2
// |  |  |  |  |--__proto__
// |  |  |  |     |--length
// |  |  |  |     |--constructor
// |  |  |  |     |--toString
// |  |  |  |     |--toLocaleString
// |  |  |  |     |--join
// |  |  |  |     |--pop
// |  |  |  |     |--push
// |  |  |  |     |--concat
// |  |  |  |     |--reverse
// |  |  |  |     |--shift
// |  |  |  |     |--unshift
// |  |  |  |     |--slice
// |  |  |  |     |--splice
// |  |  |  |     |--sort
// |  |  |  |     |--filter
// |  |  |  |     |--forEach
// |  |  |  |     |--some
// |  |  |  |     |--every
// |  |  |  |     |--map
// |  |  |  |     |--indexOf
// |  |  |  |     |--lastIndexOf
// |  |  |  |     |--reduce
// |  |  |  |     |--reduceRight
// |  |  |  |     |--__proto__
// |  |  |  |        |--constructor
// |  |  |  |        |--toString
// |  |  |  |        |--toLocaleString
// |  |  |  |        |--valueOf
// |  |  |  |        |--hasOwnProperty
// |  |  |  |        |--isPrototypeOf
// |  |  |  |        |--propertyIsEnumerable
// |  |  |  |        |--__defineGetter__
// |  |  |  |        |--__lookupGetter__
// |  |  |  |        |--__defineSetter__
// |  |  |  |        |--__lookupSetter__
// |  |  |  |        |--__proto__
// |  |  |  |           |--null
// |  |  |  |--__proto__
// |  |  |     |--constructor
// |  |  |     |--toString
// |  |  |     |--toLocaleString
// |  |  |     |--valueOf
// |  |  |     |--hasOwnProperty
// |  |  |     |--isPrototypeOf
// |  |  |     |--propertyIsEnumerable
// |  |  |     |--__defineGetter__
// |  |  |     |--__lookupGetter__
// |  |  |     |--__defineSetter__
// |  |  |     |--__lookupSetter__
// |  |  |     |--__proto__
// |  |  |        |--null
// |  |  |--__proto__
// |  |     |--constructor
// |  |     |--toString
// |  |     |--toLocaleString
// |  |     |--valueOf
// |  |     |--hasOwnProperty
// |  |     |--isPrototypeOf
// |  |     |--propertyIsEnumerable
// |  |     |--__defineGetter__
// |  |     |--__lookupGetter__
// |  |     |--__defineSetter__
// |  |     |--__lookupSetter__
// |  |     |--__proto__
// |  |        |--null
// |  |--__proto__
// |     |--constructor
// |     |--toString
// |     |--toLocaleString
// |     |--valueOf
// |     |--hasOwnProperty
// |     |--isPrototypeOf
// |     |--propertyIsEnumerable
// |     |--__defineGetter__
// |     |--__lookupGetter__
// |     |--__defineSetter__
// |     |--__lookupSetter__
// |     |--__proto__
// |        |--null
// |--b
// |--c
// |  |--0
// |  |--1
// |  |--2
// |  |--3
// |  |--__proto__
// |     |--length
// |     |--constructor
// |     |--toString
// |     |--toLocaleString
// |     |--join
// |     |--pop
// |     |--push
// |     |--concat
// |     |--reverse
// |     |--shift
// |     |--unshift
// |     |--slice
// |     |--splice
// |     |--sort
// |     |--filter
// |     |--forEach
// |     |--some
// |     |--every
// |     |--map
// |     |--indexOf
// |     |--lastIndexOf
// |     |--reduce
// |     |--reduceRight
// |     |--__proto__
// |        |--constructor
// |        |--toString
// |        |--toLocaleString
// |        |--valueOf
// |        |--hasOwnProperty
// |        |--isPrototypeOf
// |        |--propertyIsEnumerable
// |        |--__defineGetter__
// |        |--__lookupGetter__
// |        |--__defineSetter__
// |        |--__lookupSetter__
// |        |--__proto__
// |           |--null
// |--__proto__
// |  |--constructor
// |  |--toString
// |  |--toLocaleString
// |  |--valueOf
// |  |--hasOwnProperty
// |  |--isPrototypeOf
// |  |--propertyIsEnumerable
// |  |--__defineGetter__
// |  |--__lookupGetter__
// |  |--__defineSetter__
// |  |--__lookupSetter__
// |  |--__proto__
// |     |--null
