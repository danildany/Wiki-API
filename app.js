//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:true}));

app.use(express.static("public"));
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dcp1i.mongodb.net/wikiDB`,{useNewUrlParser : true, useUnifiedTopology: true })

const articleSchema = {
    title: String,
    content: String,
    image: String
};

const Article = new mongoose.model('Article' , articleSchema);

//////////////////////////////////request targetting all articles ////////////////////////////
app.route('/articles')
.get((req,res)=>{
    Article.find({},(err, foundArticles)=>{
        if(err){
            console.log(err);
        }else{
            res.send(foundArticles);
        }
    })
})
.post((req,res)=>{
    const newArticle = new Article({
        title : req.body.title,
        content : req.body.content,
        image : req.body.image
    })
    newArticle.save((err)=>{
        if(err){
            res.send(err);
        }else{
            res.send('Article added.')
        }
    });
})
.delete((req,res)=>{

    Article.deleteMany((err)=>{
        if(err){
            res.send(err);
        }else{
            res.send('All articles deleted.')
        }
    });
})
//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////request targetting an specific article ////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
app.route('/articles/:articleTitle')
.get((req,res)=>{
    Article.findOne({title: req.params.articleTitle},(err,foundArticle)=>{
        if(foundArticle){
            res.send(foundArticle)
        }else{
            res.send('no articles matching')
        }
    })
})
.put((req, res) => {
    Article.replaceOne(
      {title: req.params.articleTitle},
      {title: req.body.title,content: req.body.content,image: req.body.image},
      (err) => {
        if (err) {
          res.send(err);
        } else {
          res.send('Successfully put article.');
        }
    });
})
.patch((req, res) => {
    Article.updateOne(
      {title: req.params.articleTitle},
      {$set: req.body},
      (err) => {
        if (err) {
          res.send(err);
        } else {
          res.send("Successfully patched article.");
        }
    });
  }).delete((req,res) => {
    Article.deleteOne(
        {title: req.params.articleTitle},
        (err)=>{
            if(err){
                res.send(err);
            }else{
                res.send('element deleted');
            }
        }
    )
  }); 


app.listen(3000, function() {
  console.log("Server started on port 3000");
});