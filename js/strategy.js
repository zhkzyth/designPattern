//策略模式

//初始版
validator = {
   validate:function  (value,type) {
      switch(type){
         case 'isNonEmpty':
         {
            return true;//NonEmpty
         }
         case 'isNumber':
         {
            return true; //number
            break;
         }
         case 'isAlpha':
         {
            return true;
         }
         default:{
            return true;
         }
      }
   }
}

//test case
alert(validator.validate("123","isNonEmpty"));



//使用模式后
var validator = {
   //所有可以的验证规则处理类存放的地方，后面会单独定义
   types:{},

   //验证类型对应的错误信息
   message:{},

   //使用的验证类型
   config:{},

   //暴露的公开方法
   //key=>value
   validate:function  (data) {

      var i,msg,type,checker,result_ok;

      //清空错误信息
      this.message=[];

      for (i in data) {
         if (data.hasOwnProperty(i)) {

            type = this.type[i];
            checker = this.type[type];//get the correspoding checker

            if (!type) {
               continue;//数据项不需要验证
            };

            if (!checker) {
               throw {
                  name:"Validate Error",
                  message:"No handler to validate type "+type;
               }
            };

            result_ok = checker.validate(data[i]);

            if (!result_ok) {
               msg = result_ok.instruction;
               this.message.push(msg);
            };
         };
      };
      return this.hasError();
   },

   //helper
   hasError:function  (argument) {
      return this.message.length !== 0;
   }
}



//填充验证类
validator.types.isNonEmpty = {
   validate:function  (value) {
      return value !=="";
   },
   instruction:"传入值不能为空"
};

//
validator.types.isNumber = {
   validate:function  (value) {
      return isNan(value);
   },
   instruction:"传入值必须为数字"
};

validator.types.isAlphaNum = {
   validate:function  (value) {
      return !/[^a-z0-9]/i.test(value);
   },
   instruction:"传入值必须为数字或字母"
};


//config for our test，可以暴露给使用方
var data={
   first_name:"Tom",
   last_name:"Xu",
   age:"14",
   username:"zhkzyth"
}

validator.config = {
   first_name:"isNonEmpty",
   age:"isNumber",
   username:"isAlpha"
}

validator.validate(data);

if(validator.hasError()){
   console.log(validator.message.join("\n"));
}



//总结：
// 1.提供简洁的接口
// 2.避免修改，而是不断增加的方式
// 3.可以配置验证机制，修改灵活
// ........








