/**
 * 遍历对象的属性，包括原型属性
 */
var person = {
    NO : 'CA92384',
    city : 'BeiJing'
}

person.person = {
    name:'Tom',
    address : {
        province: '北京',
        city: '北京市',
        area : '海淀区'
    },
    age : 23,
    department : '机票事业部',
    job : 'FE'
}

person.other = {
    //aa : obj.a,
    company: 'Qunar',
    mobile : '1861222222',
    sex : 'F'
}

person._id = "CA9238419"

//obj.a.b = obj.b;

// obj.a = {
//     'a1' : 'a',
//     'b1' : {
//         'aa' : 'aa',
//         'bb' : {
//             'aaa' : 'aaa',
//             'ccc' : [1, 2, 3]
//         }
//     }
// }
// obj.b = 'b';
// obj.c = [1, 2, 3, 4];
// obj.sayName = function(){
//     //...
// }

// var a = {
//     name : 'a',
//     b : b
// }
//
// var b = {
//     name : 'b',
//     c : c
// }
//
// var c = {
//     name : 'c',
//     a : a
// }
//
// b.c = c;
//
// a.b = b;


// function Person(){
//     this.name = 'name';
//     this.age = 23;
//     this.addr = 'addr'
// }
// Person.prototype.sayName = function(){alert('sayName')}
// Person.prototype.sayName.name = "sayName"
//
// var obj = new Person();





var buildInObjects = [
    Date.prototype,
    Function.prototype,
    Object.prototype,
    String.prototype,
    Number.prototype,
    Boolean.prototype,
    RegExp.prototype
]

var buildInObjStr = [
    'Date.prototype',
    'Function.prototype',
    'Object.prototype',
    'String.prototype',
    'Number.prototype',
    'Boolean.prototype',
    'RegExp.prototype'
]

function getProps(obj, isProto){
    return type(obj) === 'object' || type(obj) === 'function'
        ? Object.getOwnPropertyNames(obj)
        : []
    // return type(obj) === 'object' || type(obj) === 'function'
    //               // 如果是__proto__用getOwnPropertyNames获取不可枚举的属性名称
    //               // 否则获取自身可枚举属性名称
    //               ? isProto
    //                     ? Object.getOwnPropertyNames(obj)
    //                     : Object.keys(obj)
    //               : []
}

function type(obj){
    return typeof obj
}

/**
 * 检测循环依赖
 */
function checkCircleDependence(obj, parents){
    var result = false;
    for(var i=0, len = parents.length; i<len; i++){
        if(parents[i] === obj){
            result = true
            break
        }
    }

    return result
}

function getPrex(){
    //TODO ...
}

/**
 *
 * @param obj
 * @param isProto
 * @param from
 * @param name
 * @param prex
 */
function proto(obj, isProto, from, name, prex, _id, _parentID, index){
    var keys, curr, currPrex, len, objType,buildObjIndex;
    prex = prex || '';
    from = from || [];

    //console.warn('from' ,from)

    // 如果prex===''(第一级)显示为: |--
    // 否则显示为: |    |--,空格个数根据级别增加
    currPrex = '|' + prex + (prex === '' ? '--' : '|--');

    if(!obj){
        // 如果obj为null,返回
        console.log(currPrex + 'null');
        return
    }
    ///////////////////
    posObj[_id] = createEntity(obj, name, from.length, _id, _parentID);

    _id && _parentID && relation(_id, _parentID, index || 0)
    //////////////////
    keys = getProps(obj, isProto);
    //如果没有__proto__属性，加入数组遍历__proto__
    !~keys.indexOf('__proto__') && keys.push('__proto__');
    len = keys.length;

    keys.forEach(function(ele, idx, all){

        console.log(currPrex + ele)
        // 访问属性可能报错
        // 比如:
        // function Person(){}
        // Person.prototype.sayName = function(){}
        // Person.prototype.sayName.prototype.__proto__.constructor.deliverChangeRecords.arguments
        // TypeError: 'caller', 'callee', and 'arguments' properties may not be accessed on strict mode functions or the arguments objects for calls to them
        try{
            objType = type(curr = obj[ele]);

            if(objType === 'object' || objType === 'function'){
                if(~(buildObjIndex = buildInObjects.indexOf(curr))){
                    //console.log('指向', buildInObjects[buildObjIndex])
                    //console.log('|' + prex + (idx === len -1 ? '   |--' : '|  |--'), buildInObjects[buildObjIndex])

                    console.log('|' + prex + (idx === len -1 ? '   |--' : '|  |--'), buildInObjStr[buildObjIndex])
                    //createEntity(curr, buildInObjStr[buildObjIndex], from.length, _id, _parentID);
                    return
                }

                //检测循环依赖
                if(!checkCircleDependence(curr, from)){
                    // 递归处理对象
                    // 如果第一级增加两个个空格， 最后一级增加三个空格，其他增加'|  '
                    proto(curr, ele === '__proto__' || objType === 'function',
                            from.concat(obj),
                            ele, prex + (prex === '' ? '  ' : (idx === len - 1 ? '   ' : '|  '))
                            ,Math.guid(), _id, idx
                        )
                }else{
                    console.log('|' + prex + (idx === len -1 ? '   |--' : '|  |--'), curr)
                    //console.log('循环依赖');
                }
            }
        }catch(e){
            console.warn('Exception : ', e.message)
        }
    });
}

var deepObj = {};
var a = 2;
var posObj = {};

function createEntity(obj, name, deep, _id, _parentID){
    var ul = document.createElement('ul'),
        li = document.createElement('li'),
        keys = Object.getOwnPropertyNames(obj),
        i = 0,
        len = keys.length,
        tmp;

    keys.push('__proto__');
    len++;

    deepObj[deep] = (deepObj[deep] || 0) + 1;


    // var title = document.createElement('div');
    // title.innerHTML = name || ':(';
    // document.body.appendChild(title);

    var posX = deep * 260 + 10,
        posY = (deepObj[deep] - 1) * 200 + 20;

    ul.style.position = 'absolute';
    ul.style.width = '200px';
    ul.style.top = posY;
    ul.style.left = posX;
    ul.style.overflow = 'scroll';
    ul.style.border = '1px solid black';

    ul.id = _id;

    tmp = li.cloneNode();
    tmp.style.background = '#BEF4AA';
    tmp.innerHTML = '<div style="color:red; font-size:14px; text-align:center">' + (name || '') + ' [' + typeof(obj) + ']</div>';
    ul.appendChild(tmp);

    for(; i<len; i++){
        tmp = li.cloneNode();
        tmp.innerHTML = '<span class="cell">' + keys[i] + '</span>' + ' <span class="cell">' +
            (type(obj[keys[i]]) === 'function' || type(obj[keys[i]]) === 'object'
            ? '[' + type(obj[keys[i]]) + ']'
            : type(obj[keys[i]]) === 'string' ? '"' + obj[keys[i]] + '"' : obj[keys[i]]) ;
        ul.appendChild(tmp);
    }

    document.body.appendChild(ul);

    return {
        left : posX,
        top  : posY
    }

}

function relation(id, parentID, index){
    //var svg = document.createElement('svg');
    var svg = document.getElementById('j-svg');
    //var path = document.createElement('path');
    var path = document.createElementNS("http://www.w3.org/2000/svg", "path")
    //svg.setAttribute('width', '100%');
    //svg.setAttribute('height', '100%');
    var start = posObj[parentID],
        end = posObj[id];
    if(!start || !end){
        return
    }
    var startX = start.left + 200,
        startY = (start.top + 21 * index + 30),
        endX = end.left,
        endY = end.top + 10;

    // 折现
    path.setAttribute('d',
        //起点
        'M ' + startX + ' ' + startY +
        //下中点
        ' L ' + (endX + startX) / 2 + ' ' + startY +
        //上中点
        ' L ' + (endX + startX) / 2 + ' ' + endY +
        //终点
        ' L ' + endX + ' ' + endY);
    // 贝塞尔曲线
    // <path d="M97 336 C288 339 143 55 327 51" />
    // tools http://blogs.sitepointstatic.com/examples/tech/svg-curves/cubic-curve.html
    // path.setAttribute('d',
    //     'M' + startX + ',' + startY + ' C' + [endX, startY, startX, endY, endX, endY].join(' ')
    // )
    path.setAttribute('stroke', "orange");
    path.setAttribute('stroke-width', "1");
    path.setAttribute('fill', "none");
    path.setAttribute('marker-end',"url(#markerArrow)");
    //path.setAttribute('stroke-dasharray', "10 5 5 5");
    path.setAttribute('style','cursor:pointer');
    path.setAttribute('relation',id + parentID);
    path.addEventListener('mouseover', function(){
        setTimeout(function(){
            $(id).style.background = "rgba(235,13,13,.6)";
            $(parentID).style.background = "rgba(235,13,13,.6)";
            path.setAttribute('stroke-dasharray', "10 5 5 5");
        },200)
    })
    path.addEventListener('mouseout', function(){
        setTimeout(function(){
            path.setAttribute('stroke-dasharray', "");
            $(id).style.background = "";
            $(parentID).style.background = "";
        },200)
    })
    svg.appendChild(path);
    //document.body.appendChild(svg);
}

/**
 * Math.guid
 * from : http://www.broofa.com/2008/09/javascript-uuid-function/
 */
Math.guid = function(){
    return 'xxxxxxxx-xxxx-4xxx-yxxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c){
        var r = Math.random() * 16 | 0,
            v = c === 'x' ? r : (r & 0x3 | 0x8);

        return v.toString(16)
    }).toUpperCase();
}

console.log('person:')
proto(person, false, [],'person', '', Math.guid());
console.log('over....');


function $(selector){
    return document.getElementById(selector);
    //return document.querySelectorAll(selector);
}

// Person:
// |--name
// |--age
// |--addr
// |--__proto__
// |  |--constructor
// |  |  |--length
// |  |  |--name
// |  |  |--arguments
// |  |  |  |--null
// |  |  |--caller
// |  |  |  |--null
// |  |  |--prototype
// |  |  |  |-- Person {sayName...}
// Person {sayName: function}
//
// |  |  |--__proto__
// |  |     |-- Function.prototype
// |  |--sayName
// |  |  |--length
// |  |  |--name
// |  |  |--arguments
// |  |  |  |--null
// |  |  |--caller
// |  |  |  |--null
// |  |  |--prototype
// |  |  |  |--constructor
// |  |  |  |  |-- function (){alert('sayName')}
// |  |  |  |--__proto__
// |  |  |     |-- Object.prototype
// |  |  |--__proto__
// |  |     |-- Function.prototype
// |  |--__proto__
// |     |-- Object.prototype
