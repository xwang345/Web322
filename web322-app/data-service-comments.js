const mongoose = require('mongoose');
let Schema = mongoose.Schema;

var commentSchema = new Schema({
  "authorName":  String,
  "authorEmail": String,
  "subject": String,
  "commentText": String,
  "postedDate": Date,
  "replies": [{"comment_id":  String,
                "authorName": String,
                "authorEmail": String,
                "commentText": String,
                "repliedDate": Date
              }]
});

let Comment;

module.exports.initialize = function () {
 return new Promise(function (resolve, reject) {
 let db = mongoose.createConnection("mongodb://hjpatel16:Harsh123@ds027896.mlab.com:27896/web322_a6");
 db.on('error', (err)=>{
 reject(err); // reject the promise with the provided error
 });
 db.once('open', ()=>{
 Comment = db.model("comments", commentSchema);
 resolve();
 });
 });
};

module.exports.addComment = function (data) {
 return new Promise(function (resolve, reject) {
     data.postedDate = Date.now();
    let newComment = new Comment(data);
    newComment.save((err) => {
        if(err) {
                reject("There was an error saving the comment:" + err);
  } else {
        resolve(newComment._id);
  }
});
});
};

module.exports.getAllComments = function () {
 return new Promise(function (resolve, reject) {
     Comment.find({})
     .sort({postedDate : 1})
     .exec()
     .then(function(data){
         resolve(data);
     })
     .catch(function(err){
         reject(err);
     })
   
});
};

module.exports.addReply = function (data) {
 return new Promise(function (resolve, reject) {
    data.repliedDate = Date.now();   
     Comment.update(
            { _id : data.comment_id},
            { $addToSet: { replies : data } },
            { multi: false })   
     .exec()
     .then(function(){
         resolve();
     })
     .catch(function(err){
         reject(err);
     })
   
});
};