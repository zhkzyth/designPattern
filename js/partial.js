//偏函数应用
//1.支持参数的默认值
var partialAny=(function (asp) {
   var argsOrig = aps.call(arguments,1);

   return function () {
      var args = [],
          argsPartial = aps.call(arguments),
          i=0;

      for(;i<argsOrig.length;i++){
         args[i] = argsOrig[i] === func._
                     ? argsPartial.shift()
                     : argsOrig[i];
      }

      return fn.apply(this,args.concat(argsPartial));
   }

   //占位符
   func._ = {};
})(Array.prototype.slice);

//定义处理函数
function hex (r,g,b) {
   return '#'+r+g+b;
}

//定义偏函数，将hex的第一个参数r作为不变的参数值ff
var redMax = partialAny(hex,'ff',partialAny._,partialAny._);

//新函数redMax的调用方式
console.log(redMax('11','22')); //#ff1122

//或者
var __ = partialAny._;
//so we can do this
var blueTest = partialAny(hex,__,__,'blue??');   //=.=
console.log(blueTest('12','ad'));
