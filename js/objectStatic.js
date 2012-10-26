var constant = (function () {
    var constants = {},
        ownProp = Object.prototype.hasOwnProperty,
    // 只允许设置这三种类型的值
        allowed = {
            string: 1,
            number: 1,
            boolean: 1
        },
        prefix = (Math.random() + "_").slice(2);

    return {
        // 设置名称为name的属性
        set: function (name, value) {
            if (this.isDefined(name)) {
                return false;
            }
            if (!ownProp.call(allowed, typeof value)) {
                return false;
            }
            constants[prefix + name] = value;
            return true;
        },
        // 判断是否存在名称为name的属性
        isDefined: function (name) {
            return ownProp.call(constants, prefix + name);
        },
        // 获取名称为name的属性
        get: function (name) {
            if (this.isDefined(name)) {
                return constants[prefix + name];
            }
            return null;
        }
    };
} ());

// 检查是否存在
console.log(constant.isDefined("maxwidth")); // false

// 定义
console.log(constant.set("maxwidth", 480)); // true

// 重新检测
console.log(constant.isDefined("maxwidth")); // true

// 尝试重新定义
console.log(constant.set("maxwidth", 320)); // false

// 判断原先的定义是否还存在
console.log(constant.get("maxwidth")); // 480