//接口隔离原则ISP（The Interface Segregation Principle）
//Clients should not be forced to depend on methods they do not use.
//不应该强迫客户依赖于它们不用的方法。


var exampleBinder = {};
exampleBinder.modelObserver = (function() {
    /* 私有变量 */
    return {
        observe: function(model) {
            /* 代码 */
            return newModel;
        },
        onChange: function(callback) {
            /* 代码 */
        }
    }
})();

exampleBinder.viewAdaptor = (function() {
    /* 私有变量 */
    return {
        bind: function(model) {
            /* 代码 */
        }
    }
})();

exampleBinder.bind = function(model) {
    /* 私有变量 */
    exampleBinder.modelObserver.onChange(/* 回调callback */);
    var om = exampleBinder.modelObserver.observe(model);
    exampleBinder.viewAdaptor.bind(om);
    return om;
};


//
var rectangle = {
    area: function() {
        /* 代码 */
    },
    draw: function() {
        /* 代码 */
    }
};

var geometryApplication = {
    getLargestRectangle: function(rectangles) {
        /* 代码 */
    }
};

var drawingApplication = {
    drawRectangles: function(rectangles) {
       /* 代码 */
    }
};