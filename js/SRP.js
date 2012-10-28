// Bob大叔提出并发扬了S.O.L.I.D五大原则，用来更好地进行面向对象编程，五大原则分别是：
//     The Single Responsibility Principle（单一职责SRP）
//     The Open/Closed Principle（开闭原则OCP）
//     The Liskov Substitution Principle（里氏替换原则LSP）
//     The Interface Segregation Principle（接口分离原则ISP）
//     The Dependency Inversion Principle（依赖反转原则DIP）

//鉴定方法
// Information holder – 该对象设计为存储对象并提供对象信息给其它对象。
// Structurer – 该对象设计为维护对象和信息之间的关系
// Service provider – 该对象设计为处理工作并提供服务给其它对象
// Controller – 该对象设计为控制决策一系列负责的任务处理
// Coordinator – 该对象不做任何决策处理工作，只是delegate工作到其它对象上
// Interfacer – 该对象设计为在系统的各个部分转化信息（或请求）

function Product(id, description) {
   this.getId = function() {
      return id;
   };
   this.getDescription = function() {
      return description;
   };
}

function Cart(eventAggregator) {
   var items = [];

   this.addItem = function(item) {
      items.push(item);
   };
}

(function() {
   var products = [new Product(1, "Star Wars Lego Ship"), new Product(2, "Barbie Doll"), new Product(3, "Remote Control Airplane")],
      cart = new Cart();

   function addToCart() {
      var productId = $(this).attr('id');
      var product = $.grep(products, function(x) {
         return x.getId() == productId;
      })[0];
      cart.addItem(product);

      var newItem = $('<li></li>').html(product.getDescription()).attr('id-cart', product.getId()).appendTo("#cart");
   }

   products.forEach(function(product) {
      var newItem = $('<li></li>').html(product.getDescription()).attr('id', product.getId()).dblclick(addToCart).appendTo("#products");
   });
})();



/*
 * 重构代码
*/
function Event(name) {
   var handlers = [];

   this.getName = function() {
      return name;
   };

   this.addHandler = function(handler) {
      handlers.push(handler);
   };

   this.removeHandler = function(handler) {
      for(var i = 0; i < handlers.length; i++) {
         if(handlers[i] == handler) {
            handlers.splice(i, 1);
            break;
         }
      }
   };

   this.fire = function(eventArgs) {
      handlers.forEach(function(h) {
         h(eventArgs);
      });
   };
}

//little pub/sub???
function EventAggregator() {
   var events = [];

   function getEvent(eventName) {
      return $.grep(events, function(event) {
         return event.getName() === eventName;
      })[0];
   }

   this.publish = function(eventName, eventArgs) {
      var event = getEvent(eventName);

      if(!event) {
         event = new Event(eventName);
         events.push(event);
      }
      event.fire(eventArgs);
   };

   this.subscribe = function(eventName, handler) {
      var event = getEvent(eventName);

      if(!event) {
         event = new Event(eventName);
         events.push(event);
      }

      event.addHandler(handler);
   };
}

function Product(id, description) {
    this.getId = function () {
        return id;
    };
    this.getDescription = function () {
        return description;
    };
}

function Cart(eventAggregator) {
    var items = [];

    this.addItem = function (item) {
        items.push(item);
        eventAggregator.publish("itemAdded", item);
    };
}

//CartController主要是接受cart对象和事件聚合器，
//通过订阅itemAdded来增加一个li元素节点，通过订阅productSelected事件来添加product。
function CartController(cart, eventAggregator) {
    eventAggregator.subscribe("itemAdded", function (eventArgs) {
        var newItem = $('<li></li>').html(eventArgs.getDescription()).attr('id-cart', eventArgs.getId()).appendTo("#cart");
    });

    eventAggregator.subscribe("productSelected", function (eventArgs) {
        cart.addItem(eventArgs.product);
    });
}

//Repository的目的是为了获取数据（可以从ajax里获取），
//然后暴露get数据的方法。
function ProductRepository() {
    var products = [new Product(1, "Star Wars Lego Ship"),
            new Product(2, "Barbie Doll"),
            new Product(3, "Remote Control Airplane")];

    this.getProducts = function () {
        return products;
    }
}


function ProductController(eventAggregator, productRepository) {
    var products = productRepository.getProducts();

    function onProductSelected() {
        var productId = $(this).attr('id');
        var product = $.grep(products, function (x) {
            return x.getId() == productId;
        })[0];
        eventAggregator.publish("productSelected", {
            product: product
        });
    }

    products.forEach(function (product) {
        var newItem = $('<li></li>').html(product.getDescription())
                                    .attr('id', product.getId())
                                    .dblclick(onProductSelected)
                                    .appendTo("#products");
    });
}

(function () {
    var eventAggregator = new EventAggregator(),
         cart = new Cart(eventAggregator),
         cartController = new CartController(cart, eventAggregator),
         productRepository = new ProductRepository(),
         productController = new ProductController(eventAggregator, productRepository);
})();