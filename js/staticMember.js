// 构造函数
var Gadget = function () {
};

// 公有静态方法
Gadget.isShiny = function () {
    return "you bet";
};

// 原型上添加的正常方法
Gadget.prototype.setPrice = function (price) {
    this.price = price;
};

// 调用静态方法
console.log(Gadget.isShiny()); // "you bet"

// 创建实例，然后调用方法
var iphone = new Gadget();
iphone.setPrice(500);

console.log(typeof Gadget.setPrice); // "undefined"
console.log(typeof iphone.isShiny); // "undefined"
Gadget.prototype.isShiny = Gadget.isShiny;
console.log(iphone.isShiny()); // "you bet"



//方式一
var Gadget = (function () {
    // 静态变量/属性
    var counter = 0;

    // 闭包返回构造函数的新实现
    return function () {
        console.log(counter += 1);
    };
} ()); // 立即执行

var g1 = new Gadget(); // logs 1
var g2 = new Gadget(); // logs 2
var g3 = new Gadget(); // logs 3

//方式二
var Gadget = (function () {
    // 静态变量/属性
    var counter = 0,
        NewGadget;

    //新构造函数实现
    NewGadget = function () {
        counter += 1;
   };

    // 授权可以访问的方法
    NewGadget.prototype.getLastId = function () {
        return counter;
    };

    // 覆盖构造函数
    return NewGadget;
} ()); // 立即执行

var iphone = new Gadget();
iphone.getLastId(); // 1
var ipod = new Gadget();
ipod.getLastId(); // 2
var ipad = new Gadget();
ipad.getLastId(); // 3