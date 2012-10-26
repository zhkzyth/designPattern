function getBeerById(id, callback) {
// 通过ID发送请求，然后返回数据
asyncRequest('GET', 'beer.uri?id=' + id, function(resp) {
// callback response
callback(resp.responseText);
});
}

addEvent(element, 'click', getBeerByIdBridge);
　　function getBeerByIdBridge (e) {
　　　　getBeerById(this.id, function(beer) {
　　　　　　console.log('Requested Beer: '+beer);
　　});
}