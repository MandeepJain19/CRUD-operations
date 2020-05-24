var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var path = require("path");
var multer = require("multer");
var app = express();

//connecting Database
mongoose.connect("mongodb://localhost/xapjamDB",{useNewUrlParser: true, useUnifiedTopology: true });

// Comment Schema
var commentSchema = mongoose.Schema({
	name: String,
	comment:String,
});
var comment = mongoose.model("comment", commentSchema);
// --------------------------------------------------------------------------------------
//blog Schema and model it up
// --------------------------------------------------------------------------------------
var blogSchema = mongoose.Schema({
	title: String,
	img: String,
	tags: String,
	desc: String,
	comment: [
				{
					type: mongoose.Schema.Types.ObjectId,
					ref: "comment"
				}
			],
	created_at: { type: Date, required: true, default: Date.now }
});
var blog = mongoose.model("blog",blogSchema);
// --------------------------------------------------------------------------------------


//Multer Config 
//use to upload images 
// --------------------------------------------------------------------------------------
// SET STORAGE
var storage = multer.diskStorage({
	destination: function (req, file, cb) {
    cb(null,'./public/uploads')
  },
  filename: function (req, file, cb) {
  cb(null, file.fieldname + '-' + Date.now()+ path.extname(file.originalname));  }
});
 //setting storage var for multer
var upload = multer({ storage: storage });

// --------------------------------------------------------------------------------------

app.set("view engine","ejs");//we dont have to apply ".ejs" 
app.use(express.static("public"));//app look for styleSheets in public dir
app.use(bodyParser.urlencoded({extended: true}));//use for get data from form

//Root Route Main page
// --------------------------------------------------------------------------------------
app.get("/xapjam",function(req,res){
	blog.find({}, function(err,data){
		if(err){
			console.log(err);
		}else{
		// console.log(data);
		res.render("index",{blogs:data});
		}
	})	
});
app.get("/",function(req,res){
	res.redirect("/xapjam");
});
// --------------------------------------------------------------------------------------

//blogPost 
// --------------------------------------------------------------------------------------
app.get("/xapjam/blogpost",function(req,res){
	res.render("blog form");
});
//Route handelling Post form data
app.post("/xapjam/blogpost", upload.single("image"), function(req,res){
		const file = req.file
  if (!file) {
    const error = new Error('Please upload a file')
    error.httpStatusCode = 400
    return next(error)
  }else{
			var newBlog = {
				title: req.body.title,
				img: req.file.filename,
				tags: req.body.tags,
				desc: req.body.desc,
			};
		//make this entry in database
		blog.create(newBlog,function(err,data){
			if(err)
			{
				console.log(err);
			}
			else{
				// console.log("done")
				res.redirect("/");
			}
			})
		}
	});
// --------------------------------------------------------------------------------------

//Route Show Each Blog in Full
app.get("/xapjam/:id",function(req,res){
	//find 1 blog by id
	blog.findById(req.params.id).populate("comment").exec(function(err,blog){
		if(err){
			console.log(err);
		}else{
		res.render("show",{blog : blog});	
		}
	})
	
});
// --------------------------------------------------------------------------------------

// Route Comment
app.post("/xapjam/:id/comment", function(req,res){
	blog.findById(req.params.id, function(err, blog){
		if(err){
			console.log(err);
		}else{
			var comnt={
				name: req.body.name,
				comment: req.body.comment
			};
			comment.create(comnt, function(err,comment){
				if(err){
					console.log(err);
				}else{
					blog.comment.push(comment);
					blog.save();
					res.redirect("/xapjam/"+req.params.id)
				}
			})
		}
	})
});

// --------------------------------------------------------------------------------------

//Server
app.listen("3636", function(){
	console.log("Xap server start on 3636");
});