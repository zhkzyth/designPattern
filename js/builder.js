//建造者模式

//建造者模式主要用于“分步骤构建一个复杂的对象”，在这其中“分步骤”是一个稳定的算法，
//而复杂对象的各个部分则经常变化，其优点是：建造者模式的“加工工艺”是暴露的，
//这样使得建造者模式更加灵活，并且建造者模式解耦了组装过程和创建具体部件，
//使得我们不用去关心每个部件是如何组装的。

//组装部件的算法是稳定的，但部件本身却可能因为需求的缘故，
//变动比较大....

function getBeerById(id, callback) {
    // 使用ID来请求数据，然后返回数据.
    asyncRequest('GET', 'beer.uri?id=' + id, function (resp) {
        // callback调用 response
        callback(resp.responseText);
    });
}

var el = document.querySelector('#test');
el.addEventListener('click', getBeerByIdBridge, false);

function getBeerByIdBridge(e) {
    getBeerById(this.id, function (beer) { //回调函数不需要关心数据是怎么来的
        console.log('Requested Beer: ' + beer);
    });
}