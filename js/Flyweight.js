//享元模式（Flyweight），运行共享技术有效地支持大量细粒度的对象，
//避免大量拥有相同内容的小类的开销(如耗费内存)，使大家共享一个类(元类)。

//书籍元信息
// ID
// Title
// Author
// Genre
// Page count
// Publisher ID
// ISBN

//书籍外部信息
//checkoutDate
// checkoutMember
// dueReturnDate
// availability


//不使用享元模式，
//不区分书籍的内部和外部信息
var Book = function( id, title, author, genre, pageCount,publisherID, ISBN, checkoutDate, checkoutMember, dueReturnDate,availability ){
   this.id = id;
   this.title = title;
   this.author = author;
   this.genre = genre;
   this.pageCount = pageCount;
   this.publisherID = publisherID;
   this.ISBN = ISBN;
   this.checkoutDate = checkoutDate;
   this.checkoutMember = checkoutMember;
   this.dueReturnDate = dueReturnDate;
   this.availability = availability;
};
Book.prototype = {
   getTitle:function(){
       return this.title;
   },
   getAuthor: function(){
       return this.author;
   },
   getISBN: function(){
       return this.ISBN;
   },
/*其它get方法在这里就不显示了*/

// 更新借出状态
updateCheckoutStatus: function(bookID, newStatus, checkoutDate,checkoutMember, newReturnDate){
   this.id  = bookID;
   this.availability = newStatus;
   this.checkoutDate = checkoutDate;
   this.checkoutMember = checkoutMember;
   this.dueReturnDate = newReturnDate;
},
//续借
extendCheckoutPeriod: function(bookID, newReturnDate){
    this.id =  bookID;
    this.dueReturnDate = newReturnDate;
},
//是否到期
isPastDue: function(bookID){
   var currentDate = new Date();
   return currentDate.getTime() > Date.parse(this.dueReturnDate);
 }
};


//Flyweight中有两个重要概念--内部状态intrinsic和外部状态extrinsic之分，
//内部状态就是在对象里通过内部方法管理，而外部信息可以在通过外部删除或者保存。

/*享元模式优化代码*/
var Book = function(title, author, genre, pageCount, publisherID, ISBN){
   this.title = title;
   this.author = author;
   this.genre = genre;
   this.pageCount = pageCount;
   this.publisherID = publisherID;
   this.ISBN = ISBN;
};



/* Book工厂 单例 */
var BookFactory = (function(){
   var existingBooks = {};
   return{
       createBook: function(title, author, genre,pageCount,publisherID,ISBN){
       /*查找之前是否创建*/
           var existingBook = existingBooks[ISBN];
           if(existingBook){
                   return existingBook;
               }else{
               /* 如果没有，就创建一个，然后保存*/
               var book = new Book(title, author, genre,pageCount,publisherID,ISBN);
               existingBooks[ISBN] =  book;
               return book;
           }
       }
   }
})();


/*BookRecordManager 借书管理类 单例*/
var BookRecordManager = (function(){
   var bookRecordDatabase = {};
   return{
       /*添加借书记录*/
       addBookRecord: function(id, title, author, genre,pageCount,publisherID,ISBN, checkoutDate, checkoutMember, dueReturnDate, availability){
           var book = bookFactory.createBook(title, author, genre,pageCount,publisherID,ISBN);
            bookRecordDatabase[id] ={
               checkoutMember: checkoutMember,
               checkoutDate: checkoutDate,
               dueReturnDate: dueReturnDate,
               availability: availability,
               book: book;

           };
       },
    updateCheckoutStatus: function(bookID, newStatus, checkoutDate, checkoutMember,     newReturnDate){
        var record = bookRecordDatabase[bookID];
        record.availability = newStatus;
        record.checkoutDate = checkoutDate;
        record.checkoutMember = checkoutMember;
        record.dueReturnDate = newReturnDate;
   },
   extendCheckoutPeriod: function(bookID, newReturnDate){
       bookRecordDatabase[bookID].dueReturnDate = newReturnDate;
   },
   isPastDue: function(bookID){
       var currentDate = new Date();
       return currentDate.getTime() > Date.parse(bookRecordDatabase[bookID].dueReturnDate);
   }
 };
})();