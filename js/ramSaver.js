var myFunc = function (param) {
    if (!myFunc.cache[param]) {
        var result = {};
        // ... 复杂操作 ...
        myFunc.cache[param] = result;
    }
    return myFunc.cache[param];
};

// cache 存储
myFunc.cache = {};

//防止参数是其他非期望类型，如toString..
var myFunc = function (param) {
    if (!myFunc.cache.hasOwnProperty(param)) {
        var result = {};
        // ... 复杂操作 ...
        myFunc.cache[param] = result;
    }
    return myFunc.cache[param];
};

// cache 存储
myFunc.cache = {};

//多个参数的情况，序列化param
var myFunc = function () {
    var cachekey = JSON.stringify(Array.prototype.slice.call(arguments)),
        result;
    if (!myFunc.cache[cachekey]) {
        result = {};
        // ... 复杂操作 ...
        myFunc.cache[cachekey] = result;
    }
    return myFunc.cache[cachekey];
};

// cache 存储
myFunc.cache = {};