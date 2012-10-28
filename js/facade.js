//首先，在设计初期，应该要有意识地将不同的两个层分离，比如经典的三层结构，
//在数据访问层和业务逻辑层、业务逻辑层和表示层之间建立外观Facade。

//其次，在开发阶段，子系统往往因为不断的重构演化而变得越来越复杂，
//增加外观Facade可以提供一个简单的接口，减少他们之间的依赖。

//第三，在维护一个遗留的大型系统时，可能这个系统已经很难维护了，
//这时候使用外观Facade也是非常合适的，为系系统开发一个外观Facade类，
//为设计粗糙和高度复杂的遗留代码提供比较清晰的接口，让新系统和Facade对象交互，
//Facade与遗留代码交互所有的复杂工作。

var addMyEvent = function (el, ev, fn) {
    if (el.addEventListener) {
        el.addEventListener(ev, fn, false);
    } else if (el.attachEvent) {
        el.attachEvent('on' + ev, fn);
    } else {
        el['on' + ev] = fn;
    }
};

var mobileEvent = {
    // ...
    stop: function (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    // ...
};