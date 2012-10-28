//中介者模式（Mediator），用一个中介对象来封装一系列的对象交互。
//中介者使各对象不需要显式地相互引用，从而使其耦合松散，而且可以独立地改变它们之间的交互。


// 如下代码是伪代码，请不要过分在意代码
// 这里app命名空间就相当于扮演中介者的角色
var app = app || {};

// 通过app中介者来进行Ajax请求
app.sendRequest = function ( options ) {
    return $.ajax($.extend({}, options);
}

// 请求URL以后，展示View
app.populateView = function( url, view ){
  $.when(app.sendRequest({url: url, method: 'GET'})
     .then(function(){
         //显示内容
     });
}

// 清空内容
app.resetView = function( view ){
   view.html('');
}


var mediator = (function () {
    // 订阅一个事件，并且提供一个事件触发以后的回调函数
    var subscribe = function (channel, fn) {
        if (!mediator.channels[channel]) mediator.channels[channel] = [];
        mediator.channels[channel].push({ context: this, callback: fn });
        return this;
    },

    // 广播事件
    publish = function (channel) {
        if (!mediator.channels[channel]) return false;
        var args = Array.prototype.slice.call(arguments, 1);
        for (var i = 0, l = mediator.channels[channel].length; i < l; i++) {
            var subscription = mediator.channels[channel][i];
            subscription.callback.apply(subscription.context, args);
        }
        return this;
    };

    return {
        channels: {},
        publish: publish,
        subscribe: subscribe,
        installTo: function (obj) {
            obj.subscribe = subscribe;
            obj.publish = publish;
        }
    };

} ());

//调用代码
(function (Mediator) {

    function initialize() {

        // 默认值
        mediator.name = "dudu";  //那数据库的维护不就全部落到mediator身上了吗？

        // 订阅一个事件nameChange
        // 回调函数显示修改前后的信息
        mediator.subscribe('nameChange', function (arg) {
            console.log(this.name);
            this.name = arg;
            console.log(this.name);
        });
    }

    function updateName() {
        // 广播触发事件，参数为新数据
        mediator.publish('nameChange', 'tom'); // dudu, tom
    }

    initialize(); // 初始化
    updateName(); // 调用

})(mediator);