// ---------   Standard setup  ---------
var bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"), 
    express         = require("express"),
    app             = express();
    
mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost/blog_app", { useNewUrlParser: true });
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
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









// ------------------------------------------------------
//  --------- Buckle Up Buckaroo ---------
//     --------- Server Start ---------
 
app.listen(3000, () => {
    console.log("BlogApp run on port 3000.");
});

// ---------------------------------------