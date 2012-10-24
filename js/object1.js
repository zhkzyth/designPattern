function object(o) {
    function F() {
    }

    F.prototype = o;
    return new F();
}

// 要继承的父对象
var parent = {
    name: "Papa"
};

// 新对象
var child = object(parent);

// 测试
console.log(child.name); // "Papa"


// 父构造函数
function Person() {
    // an "own" property
    this.name = "Adam";
}
// 给原型添加新属性
Person.prototype.getName = function () {
    return this.name;
};
// 创建新person
var papa = new Person();
// 继承
var kid = object(papa);
console.log(kid.getName()); // "Adam"


// 父构造函数
function Person() {
    // an "own" property
    this.name = "Adam";
}
// 给原型添加新属性
Person.prototype.getName = function () {
    return this.name;
};
// 继承
var kid = object(Person.prototype);
console.log(typeof kid.getName); // "function",因为是在原型里定义的
console.log(typeof kid.name); // "undefined", 因为只继承了原型




/* 使用新版的ECMAScript 5提供的功能 */
// 要继承的父对象
var parent = {
    name: "Papa"
};

var child = Object.create(parent);

var child = Object.create(parent, {
    age: { value: 2} // ECMA5 descriptor
});
console.log(child.hasOwnProperty("age")); // true

// 首先，定义一个新对象man
var man = Object.create(null);

// 接着，创建包含属性的配置设置
// 属性设置为可写，可枚举，可配置
var config = {
    writable: true,
    enumerable: true,
    configurable: true
};

// 通常使用Object.defineProperty()来添加新属性(ECMAScript5支持）
// 现在，为了方便，我们自定义一个封装函数
var defineProp = function (obj, key, value) {
    config.value = value;
    Object.defineProperty(obj, key, config);
}

defineProp(man, 'car', 'Delorean');
defineProp(man, 'dob', '1981');
defineProp(man, 'beard', false);



var driver = Object.create( man );
defineProp (driver, 'topSpeed', '100mph');
driver.topSpeed // 100mph