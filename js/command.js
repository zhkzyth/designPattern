//命令模式(Command)的定义是：
//用于将一个请求封装成一个对象，从而使你可用不同的请求对客户进行参数化；
//对请求排队或者记录请求日志，以及执行可撤销的操作。
//也就是说改模式旨在将函数的调用、请求和操作封装成一个单一的对象，然后对这个对象进行一系列的处理。
//此外，可以通过调用实现具体函数的对象来解耦命令对象与接收对象。


(function () {

    var CarManager = {

        // 请求信息
        requestInfo: function (model, id) {
            return 'The information for ' + model +
        ' with ID ' + id + ' is foobar';
        },

        // 购买汽车
        buyVehicle: function (model, id) {
            return 'You have successfully purchased Item '
        + id + ', a ' + model;
        },

        // 组织view
        arrangeViewing: function (model, id) {
            return 'You have successfully booked a viewing of '
        + model + ' ( ' + id + ' ) ';
        }
    };
})();

CarManager.execute = function (command) {
    return CarManager[command.request](command.model, command.carID);
};


CarManager.execute({ request: "arrangeViewing", model: 'Ferrari', carID: '145523' });
CarManager.execute({ request: "requestInfo", model: 'Ford Mondeo', carID: '543434' });
CarManager.execute({ request: "requestInfo", model: 'Ford Escort', carID: '543434' });
CarManager.execute({ request: "buyVehicle", model: 'Ford Escort', carID: '543434' });
