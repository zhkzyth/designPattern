function Sandbox() {
    // 将参数转为数组
    var args = Array.prototype.slice.call(arguments),
    // 最后一个参数为callback
        callback = args.pop(),
        // 除最后一个参数外，其它均为要选择的模块
        modules = (args[0] && typeof args[0] === "string") ? args : args[0],
        i;

    // 强制使用new操作符
    //写得真漂亮啊，亲
    if (!(this instanceof Sandbox)) {
        return new Sandbox(modules, callback);
    }

    // 添加属性
    this.a = 1;
    this.b = 2;

    // 向this对象上需想添加模块
    // 如果没有模块或传入的参数为 "*" ，则以为着传入所有模块
    if (!modules || modules == '*') {
        modules = [];
        for (i in Sandbox.modules) {
            if (Sandbox.modules.hasOwnProperty(i)) {
                modules.push(i);
            }
        }
    }

    // 初始化需要的模块
    for (i = 0; i < modules.length; i += 1) {
        Sandbox.modules[modules[i]](this);
    }

    // 调用 callback
    callback(this);
}

// 默认添加原型对象
Sandbox.prototype = {
    name: "My Application",
    version: "1.0",
    getName: function () {
        return this.name;
    }
};


//定义初始化模块
Sandbox.modules = {};

Sandbox.modules.dom = function (box) {
    box.getElement = function () {
    };
    box.getStyle = function () {
    };
    box.foo = "bar";
};

Sandbox.modules.event = function (box) {
    // access to the Sandbox prototype if needed:
    // box.constructor.prototype.m = "mmm";
    box.attachEvent = function () {
    };
    box.detachEvent = function () {
    };
};

Sandbox.modules.ajax = function (box) {
    box.makeRequest = function () {
    };
    box.getResponse = function () {
    };
};


// 调用方式
Sandbox(['ajax', 'event'], function (box) {
    console.log(typeof (box.foo));
    // 没有选择dom，所以box.foo不存在
});

Sandbox('ajax', 'dom', function (box) {
    console.log(typeof (box.attachEvent));
    // 没有选择event,所以event里定义的attachEvent也不存在
});

Sandbox('*', function (box) {
    console.log(box); // 上面定义的所有方法都可访问
});