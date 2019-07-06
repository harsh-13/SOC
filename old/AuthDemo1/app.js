var express                 = require("express"),
    mongoose                = require("mongoose"),
    passport                = require("passport"),
    bodyParser              = require("body-parser"),
    User                    = require("./models/user"),
    Docs                    = require("./models/docs"),
    LocalStrategy           = require("passport-local"),
    passportLocalMongoose   = require("passport-local-mongoose")

var app = express();

mongoose.connect('mongodb://127.0.0.1:27017/USERS', {
    useNewUrlParser: true,
    useCreateIndex: true 
})

app.use(bodyParser.urlencoded({extended:true}));
//just to make a session for a logged in user
app.use(require("express-session")({
    secret:"Rusty is the best og in the world",
    resave: false,
    saveUninitialized: false
}));
//view engine used is ejs(could be normal html or hbs)
app.set('view engine','ejs');

// authentication and hashing the password string
app.use(passport.initialize());
app.use(passport.session());
//
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get("/",function(req,res){
    res.render("home");
});

app.get("/secret",isLoggedIn, function(req, res){
    res.render("secret");
});

// Auth Routes

app.get("/register", function(req, res){
    res.render("register");
});
//handling user sign up
app.post("/register", function(req, res){
User.register(new User({username:req.body.username}),req.body.password, function(err, user){
       if(err){
            console.log(err);
            return res.render('register');
        } //user stragety
        passport.authenticate("local")(req, res, function(){
            res.redirect("/secret"); //once the user sign up
       }); 
    });
});

// Login Routes

app.get("/login", function(req, res){
    res.render("login");
})

// middleware
// app.post("/file/upload", urlencodedParser, (req, res) => {
//    //const data = req.file;
// //    var obj = JSON.stringify(req.body);
// //    var jsonObj = JSON.parse(obj);
//    const dataschema = new Docs({
//     Doc_name: 'test_name',
//     source: 'none',
//     transition: [{
//         employee_id: 'test',
//         DateOfIntake: {
//             type: Date,
//             default: Date.now},
//         completed: {type: Boolean ,default: false},
//         comment: 'test1234',
//     }]
//    });

//    dataschema.source = fs.readFileSync(req.files.userPhoto.path);

//    const d = dataschema.save();
//    res.send('success');
//    res.send(d)
   
// });
app.post("/login", passport.authenticate("local",{
    successRedirect:"/secret",
    failureRedirect:"/login"
}),function(req, res){
    res.send("User is "+ req.user.id);
});

app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});


function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

// app.listen(process.env.PORT, process.env.IP, function(){
//     console.log("connect!");
// });
app.listen(3000);