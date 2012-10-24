//curying
//将多个参数的处理转化成单个参数的处理，类似链式调用。
//好处：
//1.可以让函数携带参数进行传递
//2.函数的行为可以根据参数进行响应

//TIPS:对函数进行currying化后，每currying一次，函数的参数就被分拆一次

//简单版
function add(x,y) {
   var oldx = x,old = y;
   if (typeof oldy === 'undefined') { //partial
      return function  (newy) {
         return oldx+newy;
      }
   };
   return x+y;
}

//测试
typeof add(5);
add(3)(4);

var add2000 = add(2000);
add2000(10);


//第一个参数为要应用的function，第二个参数是需要传入的最少参数个数
function curry (func,minArgs) {
   if (minArgs === undefined) {
      minArgs = 1;
   };

   function funcWithArgsFrozen (frozenargs) {
      return function  () {
         //优化处理，如果调用时没有参数，返回函数本身
         var args = Array.prototype.slice.call(arguments);
         var newArgs = frozenargs.concat(args);
         if (newArgs.length>= minArgs) {
            return func.apply(this,newArgs);
         }else{
            return funcWithArgsFrozen(newArgs); //如果函数长度不符合要求，就对函数进行冻结，并返回原函数，继续接收函数...cool!
         }
      }
   };

   return funcWithArgsFrozen([]);
}


//定义我们的业务行为，比如加法
var plus = curry(function(){
   var result = 0;
   for (var i = 0; i < arguments.length; i++) {
      result += arguments[i];
   };
},2);


plus(3, 2) // 正常调用
plus(3) // 偏应用，返回一个函数（返回值为3+参数值）
plus(3)(2) // 完整应用（返回5）
plus()(3)()()(2) // 返回 5
plus(3, 2, 4, 5) // 可以接收多个参数
plus(3)(2, 3, 5) // 同理


//比如减法
var minus = curry(function  (x) {
   var result  = x;
   for (var i = 0; i < arguments.length; i++) {
      result -= arguments[i];
   };
   return result;
},2);

//调换一个函数的两个参数位置
var flip = curry(function(func){
   return curry(function(a,b){
      return func(b,a);
   },2);
});

//test case
change = function  (a,b) {
   return a-b;
}

flip(change)(3)(2);//???