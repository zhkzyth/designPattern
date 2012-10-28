//职责链模式（Chain of responsibility）是使多个对象都有机会处理请求，
//从而避免请求的发送者和接受者之间的耦合关系。
//将这个对象连成一条链，并沿着这条链传递该请求，直到有一个对象处理他为止。
var NO_TOPIC = -1;
var Topic;

function Handler(s, t) {
   this.successor = s || null;
   this.topic = t || 0;
}

Handler.prototype = {
   handle: function() {
      if(this.successor) {
         this.successor.handle()
      }
   },
   has: function() {
      return this.topic != NO_TOPIC;
   }
};


//只有最后一个对象才处理
var app = new Handler({
   handle: function() {
      console.log('app handle');
   }
}, 3);

var dialog = new Handler(app, 1);

// var button = new Handler(dialog, 2);
// button.handle();

//让button自己来进行处理？
var app = new Handler({
   handle: function() {
      console.log('app handle');
   }
}, 3);

var dialog = new Handler(app, 1);

dialog.handle = function() {
   console.log('dialog before ...')
   // 这里做具体的处理操作
   console.log('dialog after ...')
};

var button = new Handler(dialog, 2);

button.handle();

//让调用链上的每个对象处理完后，继续跑后面的调用对象
var app = new Handler({
   handle: function() {
      console.log('app handle');
   }
}, 3);

var dialog = new Handler(app, 1);
dialog.handle = function() {
   console.log('dialog before ...')
   // 这里做具体的处理操作
   Handler.prototype.handle.call(this); //继续往上走
   console.log('dialog after ...')
};

var button = new Handler(dialog, 2);
button.handle = function() {
   console.log('button before ...')
   // 这里做具体的处理操作
   Handler.prototype.handle.call(this);
   console.log('button after ...')
};

button.handle();