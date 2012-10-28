//构造函数模式

function Car(model, year, miles) {
    this.model = model;
    this.year = year;
    this.miles = miles;
    this.output= function () {
        return this.model + "走了" + this.miles + "公里";
    };
}

var tom= new Car("大叔", 2009, 20000);
var dudu= new Car("Dudu", 2010, 5000);

console.log(tom.output());
console.log(dudu.output());


//版本二
function Car(model, year, miles) {
    this.model = model;
    this.year = year;
    this.miles = miles;
    this.output= formatCar;
}

function formatCar() {
    return this.model + "走了" + this.miles + "公里";
}

//版本三
function Car(model, year, miles) {
    this.model = model;
    this.year = year;
    this.miles = miles;
}

/*
注意：这里我们使用了Object.prototype.方法名，而不是Object.prototype
主要是用来避免重写定义原型prototype对象
*/
Car.prototype.output= function () {
    return this.model + "走了" + this.miles + "公里";
};

var tom = new Car("大叔", 2009, 20000);
var dudu = new Car("Dudu", 2010, 5000);

console.log(tom.output());
console.log(dudu.output());



//版本四
function Car(model, year, miles) {
    this.model = model;
    this.year = year;
    this.miles = miles;
    // 自定义一个output输出内容
    this.output = function () {
        return this.model + "走了" + this.miles + "公里";
    }
}

//方法1：作为函数调用
Car("大叔", 2009, 20000);  //添加到window对象上
console.log(window.output());

//方法2：在另外一个对象的作用域内调用
var o = new Object();
Car.call(o, "Dudu", 2010, 5000);
console.log(o.output());


//版本五，强制this调用构造函数
function Car(model, year, miles) {
    if (!(this instanceof Car)) {
        return new Car(model, year, miles);
    }
    this.model = model;
    this.year = year;
    this.miles = miles;
    this.output = function () {
        return this.model + "走了" + this.miles + "公里";
    }
}

var tom = new Car("大叔", 2009, 20000);
var dudu = Car("Dudu", 2010, 5000);

console.log(typeof tom); // "object"
console.log(tom.output()); // "大叔走了20000公里"
console.log(typeof dudu); // "object"
console.log(dudu.output()); // "Dudu走了5000公里"


//原始包装函数.......搞不懂为什么放在一起了
// 使用原始包装函数
var s = new String("my string");
var n = new Number(101);
var b = new Boolean(true);


// 推荐这种
var s = "my string";
var n = 101;
var b = true

// 原始string
var greet = "Hello there";
// 使用split()方法分割
greet.split(' ')[0]; // "Hello"
// 给原始类型添加新属性不会报错
greet.smile = true;
// 单没法获取这个值（18章ECMAScript实现里我们讲了为什么）
console.log(typeof greet.smile); // "undefined"

// 原始string
var greet = new String("Hello there");
// 使用split()方法分割
greet.split(' ')[0]; // "Hello"
// 给包装函数类型添加新属性不会报错
greet.smile = true;
// 可以正常访问新属性
console.log(typeof greet.smile); // "boolean"