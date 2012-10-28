// Subtypes must be substitutable for their base types.
// 派生类型必须可以替换它的基类型。

function Vehicle(my) {
    var my = my || {};
    my.speed = 0;
    my.running = false;

    this.speed = function() {
        return my.speed;
    };
    this.start = function() {
        my.running = true;
    };
    this.stop = function() {
        my.running = false;
    };
    this.accelerate = function() {
        my.speed++;
    };
    this.decelerate = function() {
        my.speed--;
    }, this.state = function() {
        if (!my.running) {
            return "parked";
        }
        else if (my.running && my.speed) {
            return "moving";
        }
        else if (my.running) {
            return "idle";
        }
    };
}

//
function FastVehicle(my) {
    var my = my || {};

    var that = new Vehicle(my);
    that.accelerate = function() {
        my.speed += 3;
    };
    return that;
}

//use sample
var maneuver = function(vehicle) {
    write(vehicle.state());
    vehicle.start();
    write(vehicle.state());
    vehicle.accelerate();
    write(vehicle.state());
    write(vehicle.speed());
    vehicle.decelerate();
    write(vehicle.speed());
    if (vehicle.state() != "idle") {
        throw "The vehicle is still moving!";
    }
    vehicle.stop();
    write(vehicle.state());
};


//
var rectangle = {
    length: 0,
    width: 0
};

var square = {};
(function() {
    var length = 0, width = 0;
    // 注意defineProperty方式是262-5版的新特性
    Object.defineProperty(square, "length", {
        get: function() { return length; },
        set: function(value) { length = width = value; }
    });
    Object.defineProperty(square, "width", {
        get: function() { return width; },
        set: function(value) { length = width = value; }
    });
})();

//如果换算正方形的面积就萎了...
var g = function(rectangle) {
    rectangle.length = 3;
    rectangle.width = 4;
    write(rectangle.length);
    write(rectangle.width);
    write(rectangle.length * rectangle.width);
};