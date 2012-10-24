var one = {
    name: 'object',
    say: function (greet) {
        return greet + ', ' + this.name;
    }
};

// 测试
console.log(one.say('hi')); // "hi, object"

var two = {
    name: 'another object'
};

console.log(one.say.apply(two, ['hello'])); // "hello, another object"

// 将say赋值给一个变量，this将指向到全局变量
var say = one.say;
console.log(say('hoho')); // "hoho, undefined"

// 传入一个回调函数callback
var yetanother = {
    name: 'Yet another object',
    method: function (callback) {
        return callback('Hola');
    }
};
console.log(yetanother.method(one.say)); // "Holla, undefined"

function bind(o, m) {
    return function () {
        return m.apply(o, [].slice.call(arguments));
    };
}

var twosay = bind(two, one.say);
console.log(twosay('yo')); // "yo, another object"


// ECMAScript 5给Function.prototype添加了一个bind()方法，以便很容易使用apply()和call()。

if (typeof Function.prototype.bind === 'undefined') {
    Function.prototype.bind = function (thisArg) {
        var fn = this,
slice = Array.prototype.slice,
args = slice.call(arguments, 1);
        return function () {
            return fn.apply(thisArg, args.concat(slice.call(arguments)));
        };
    };
}

var twosay2 = one.say.bind(two);
console.log(twosay2('Bonjour')); // "Bonjour, another object"

var twosay3 = one.say.bind(two, 'Enchanté');
console.log(twosay3()); // "Enchanté, another object"