var Car = (function () {
    var Car = function (model, year, miles) {
        this.model = model;
        this.year = year;
        this.miles = miles;
    };
    return function (model, year, miles) {
        return new Car(model, year, miles);
    };
})();

var tom = new Car("Tom", 2009, 20000);
var dudu = new Car("Dudu", 2010, 5000);


/*
版本二
*/
var productManager = {};

productManager.createProductA = function () {
    console.log('ProductA');
}

productManager.createProductB = function () {
    console.log('ProductB');
}

productManager.factory = function (typeType) {
    return new productManager[typeType];
}

productManager.factory("createProductA");



/*
版本三
*/
var page = page || {};

page.dom = page.dom || {};
//子函数1：处理文本
page.dom.Text = function () {
    this.insert = function (where) {
        var txt = document.createTextNode(this.url);
        where.appendChild(txt);
    };
};

//子函数2：处理链接
page.dom.Link = function () {
    this.insert = function (where) {
        var link = document.createElement('a');
        link.href = this.url;
        link.appendChild(document.createTextNode(this.url));
        where.appendChild(link);
    };
};

//子函数3：处理图片
page.dom.Image = function () {
    this.insert = function (where) {
        var im = document.createElement('img');
        im.src = this.url;
        where.appendChild(im);
    };
};

page.dom.factory = function (type) {
    return new page.dom[type];
}

//use sample
var o = page.dom.factory('Link');
o.url = 'http://www.cnblogs.com';
o.insert(document.body);