// ---------   Standard setup  ---------
var bodyParser      = require("body-parser"),
    methodOverride  = require("method-override"),
    expressSanitizer= require("express-sanitizer"),
    mongoose        = require("mongoose"), 
    express         = require("express"),
    app             = express();
    
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);
mongoose.connect("mongodb://localhost/blog_app", { useNewUrlParser: true });
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(express.static('public'));
app.use(methodOverride("_method"));
// ------------------------------------------------------
// --------- Mongoose Mode Config ---------
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});
var Blog = mongoose.model("Blog", blogSchema);
// ------------------------------------------------------
// --------- Restfull Routs ---------

app.get("/", (req, res) => {
    res.redirect("/blogs");
});

// GET Index and NEW route
app.get("/blogs", (req, res) => {
    Blog.find({}, (err, blogs) => {
        if(err){
            console.log("ERROR!!");
            console.log(err);
        } else {
        res.render("index", {blogs: blogs});
        }    
    }); 
});

app.get("/blogs/new", (req, res) =>{
    res.render("new");
});

// POST route
app.post("/blogs", (req, res) => {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, (err, newBlog) => {
        if(err){
            res.render("new");
        } else {
            res.redirect("/blogs");
        }
    });

});

// SHOW route
app.get("/blogs/:id", (req, res) =>{
    Blog.findById(req.params.id, (err, foundBlog) => {
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("show", {blog: foundBlog});
        }
    });
});


// EDIT route
app.get("/blogs/:id/edit", (req, res) => {
    Blog.findById(req.params.id, (err, foundBlog) => {
        if(err) {
            res.redirect("/blogs");
        } else {
            res.render("edit", {blog: foundBlog});
        }
    });
    
});

// UPDATE route
app.put("/blogs/:id", (req, res) => {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });

});

// 

app.delete("/blogs/:id", (req, res) => {
   Blog.findByIdAndRemove(req.params.id, (err) => {
       if(err){
           res.redirect("/blogs");
       } else {
           res.redirect("/blogs");
       }
   });
});

// ------------------------------------------------------
//  --------- Buckle Up Buckaroo ---------
//     --------- Server Start --------- 
app.listen(3000, () => {
    console.log("BlogApp run on port 3000.");
});

// ---------------------------------------