var asyncRequest = (function() {
   function handleReadyState(o, callback) {
      var poll = window.setInterval(

      function() {
         if(o && o.readyState == 4) {
            window.clearInterval(poll);
            if(callback) {
               callback(o);
            }
         }
      }, 50);
   }

   var getXHR = function() {
         var http;
         try {
            http = new XMLHttpRequest;
            getXHR = function() {
               return new XMLHttpRequest;
            };
         } catch(e) {
            var msxml = ['MSXML2.XMLHTTP.3.0', 'MSXML2.XMLHTTP', 'Microsoft.XMLHTTP'];

            for(var i = 0, len = msxml.length; i < len; ++i) {
               try {
                  http = new ActiveXObject(msxml[i]);
                  getXHR = function() {
                     return new ActiveXObject(msxml[i]);
                  };
                  break;
               } catch(e) {}
            }
         }
         return http;
      };

   return function(method, uri, callback, postData) {
      var http = getXHR();
      http.open(method, uri, true);
      handleReadyState(http, callback);
      http.send(postData || null);
      return http;
   };
})();


//helper func
Function.prototype.method = function(name, fn) {
   this.prototype[name] = fn;
   return this;
};

if(!Array.prototype.forEach) {
   Array.method('forEach', function(fn, thisObj) {
      var scope = thisObj || window;
      for(var i = 0, len = this.length; i < len; ++i) {
         fn.call(scope, this[i], i, this);
      }
   });
}

if(!Array.prototype.filter) {
   Array.method('filter', function(fn, thisObj) {
      var scope = thisObj || window;
      var a = [];
      for(var i = 0, len = this.length; i < len; ++i) {
         if(!fn.call(scope, this[i], i, this)) {
            continue;
         }
         a.push(this[i]);
      }
      return a;
   });
}


window.DED = window.DED || {};
DED.util = DED.util || {};
DED.util.Observer = function() {
   this.fns = [];
}

DED.util.Observer.prototype = {
   subscribe: function(fn) {
      this.fns.push(fn);
   },

   unsubscribe: function(fn) {
      this.fns = this.fns.filter(

      function(el) {
         if(el !== fn) {
            return el;
         }
      });
   },
   fire: function(o) {
      this.fns.forEach(

      function(el) {
         el(o);
      });
   }
};


DED.Queue = function() {
   // 包含请求的队列.
   this.queue = [];
   // 使用Observable对象在3个不同的状态上，以便可以随时订阅事件
   this.onComplete = new DED.util.Observer;
   this.onFailure = new DED.util.Observer;
   this.onFlush = new DED.util.Observer;

   // 核心属性，可以在外部调用的时候进行设置
   this.retryCount = 3;
   this.currentRetry = 0;
   this.paused = false;
   this.timeout = 5000;
   this.conn = {};
   this.timer = {};
};

DED.Queue.
method('flush', function() {
   // flush方法
   if(!this.queue.length > 0) {
      return;
   }

   if(this.paused) {
      this.paused = false;
      return;
   }

   var that = this;
   this.currentRetry++;
   var abort = function() {
         that.conn.abort();
         if(that.currentRetry == that.retryCount) {
            that.onFailure.fire();
            that.currentRetry = 0;
         } else {
            that.flush();
         }
      };

   this.timer = window.setTimeout(abort, this.timeout);
   var callback = function(o) {
         window.clearTimeout(that.timer);
         that.currentRetry = 0;
         that.queue.shift();
         that.onFlush.fire(o.responseText);
         if(that.queue.length == 0) {
            that.onComplete.fire();
            return;
         }

         // recursive call to flush
         that.flush();

      };

   this.conn = asyncRequest(
   this.queue[0]['method'], this.queue[0]['uri'], callback, this.queue[0]['params']);
}).
method('setRetryCount', function(count) {
   this.retryCount = count;
}).
method('setTimeout', function(time) {
   this.timeout = time;
}).
method('add', function(o) {
   this.queue.push(o);
}).
method('pause', function() {
   this.paused = true;
}).
method('dequeue', function() {
   this.queue.pop();
}).
method('clear', function() {
   this.queue = [];
});



var q = new DED.Queue;
// 设置重试次数高一点，以便应付慢的连接
q.setRetryCount(5);
// 设置timeout时间
q.setTimeout(1000);
// 添加2个请求.
q.add({
   method: 'GET',
   uri: '/path/to/file.php?ajax=true'
});

q.add({
   method: 'GET',
   uri: '/path/to/file.php?ajax=true&woe=me'
});

// flush队列
q.flush();
// 暂停队列，剩余的保存
q.pause();
// 清空.
q.clear();
// 添加2个请求.
q.add({
   method: 'GET',
   uri: '/path/to/file.php?ajax=true'
});

q.add({
   method: 'GET',
   uri: '/path/to/file.php?ajax=true&woe=me'
});

// 从队列里删除最后一个请求.
q.dequeue();
// 再次Flush
q.flush();


<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"
"http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
    <meta http-equiv="Content-type" content="text/html; charset=utf-8">
    <title>Ajax Connection Queue</title>
    <script src="utils.js"></script>
    <script src="queue.js"></script>
    <script type="text/javascript">
        addEvent(window, 'load', function () {
            // 实现.
            var q = new DED.Queue;
            q.setRetryCount(5);
            q.setTimeout(3000);
            var items = $('items');
            var results = $('results');
            var queue = $('queue-items');
            // 在客户端保存跟踪自己的请求
            var requests = [];
            // 每个请求flush以后，订阅特殊的处理步骤
            q.onFlush.subscribe(function (data) {
                results.innerHTML = data;
                requests.shift();
                queue.innerHTML = requests.toString();
            });
            // 订阅时间处理步骤
            q.onFailure.subscribe(function () {
                results.innerHTML += ' <span style="color:red;">Connection Error!</span>';
            });
            // 订阅全部成功的处理步骤x
            q.onComplete.subscribe(function () {
                results.innerHTML += ' <span style="color:green;">Completed!</span>';
            });
            var actionDispatcher = function (element) {
                switch (element) {
                    case 'flush':
                        q.flush();
                        break;
                    case 'dequeue':
                        q.dequeue();
                        requests.pop();
                        queue.innerHTML = requests.toString();
                        break;
                    case 'pause':
                        q.pause();
                        break;
                    case 'clear':
                        q.clear();
                        requests = [];
                        queue.innerHTML = '';
                        break;
                }
            };
            var addRequest = function (request) {
                var data = request.split('-')[1];
                q.add({
                    method: 'GET',
                    uri: 'bridge-connection-queue.php?ajax=true&s=' + data,
                    params: null
                });
                requests.push(data);
                queue.innerHTML = requests.toString();
            };
            addEvent(items, 'click', function (e) {
                var e = e || window.event;
                var src = e.target || e.srcElement;
                try {
                    e.preventDefault();
                }
                catch (ex) {
                    e.returnValue = false;
                }
                actionDispatcher(src.id);
            });
            var adders = $('adders');
            addEvent(adders, 'click', function (e) {
                var e = e || window.event;
                var src = e.target || e.srcElement;
                try {
                    e.preventDefault();
                }
                catch (ex) {
                    e.returnValue = false;
                }
                addRequest(src.id);
            });
        });
    </script>
    <style type="text/css" media="screen">
        body
        {
            font: 100% georgia,times,serif;
        }
        h1, h2
        {
            font-weight: normal;
        }
        #queue-items
        {
            height: 1.5em;
        }
        #add-stuff
        {
            padding: .5em;
            background: #ddd;
            border: 1px solid #bbb;
        }
        #results-area
        {
            padding: .5em;
            border: 1px solid #bbb;
        }
    </style>
</head>
<body id="example">
    <div id="doc">
        <h1>
            异步联接请求</h1>
        <div id="queue-items">
        </div>
        <div id="add-stuff">
            <h2>向队列里添加新请求</h2>
            <ul id="adders">
                <li><a href="#" id="action-01">添加 "01" 到队列</a></li>
                <li><a href="#" id="action-02">添加 "02" 到队列</a></li>
                <li><a href="#" id="action-03">添加 "03" 到队列</a></li>
            </ul>
        </div>
        <h2>队列控制</h2>
        <ul id='items'>
            <li><a href="#" id="flush">Flush</a></li>
            <li><a href="#" id="dequeue">出列Dequeue</a></li>
            <li><a href="#" id="pause">暂停Pause</a></li>
            <li><a href="#" id="clear">清空Clear</a></li>
        </ul>
        <div id="results-area">
            <h2>
                结果:
            </h2>
            <div id="results">
            </div>
        </div>
    </div>
</body>
</html>