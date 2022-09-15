if (process.env.NODE_ENV !== "production"){
    require("dotenv").config();
}



const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');


//Requiering session and flash
const session = require('express-session');
const flash = require('connect-flash');



//Requiering passport and User
const passport = require('passport');
const localStrategy = require('passport-local');


const User = require('./models/user');

const mongoSanitize = require('express-mongo-sanitize');

//Requiering Routes
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');

const MongoStore = require('connect-mongo');


const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';
// getting-started mongoose
main().catch(err => console.log(err));
//
async function main() {
    await mongoose.connect(dbUrl)
    console.log('data connected')
};


const app = express();

app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.use(express.urlencoded({extended :true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')))

app.use(mongoSanitize({
    replaceWith: '_'
}));

const secret = process.env.SECRET || 'mysecret'

const store = MongoStore.create({
    mongoUrl: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60
});
store.on('error',function(e){
    console.log('SESSION STORE ERROR ' ,e)
})

//Using session and flash
const sessionConfig = {
    store,
    name:'session',
    secret,
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly: true,
        //secure: true,
        expires:Date.now() + ( 1000 * 60 * 60 * 24 * 7 ),
        maxAge: 1000 * 60 * 60 * 24 * 7,
    }
}
app.use(session(sessionConfig))
app.use(flash());



// getting-started passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




//public variables on locals
app.use((req,res,next) =>{
    // To show or hide login-status buttons on nav-bar
    res.locals.currentUser = req.user;

        // To use flash on every template
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


//Using the routes
app.use('/campgrounds',campgroundRoutes);
app.use('/campgrounds/:id/reviews',reviewRoutes);
app.use('/',userRoutes);



app.get('/',(req,res)=>{
    res.render('home.ejs') 
})



// 404 Error
app.all('*',(req,res,next) => {
    next(new ExpressError('Page Not Found',404))
})

// Error handeler
app.use((err,req,res,next)=>{
    const {statusCode = 500,} = err;
    if(!err.message) err.message = 'Something went wrong';
    res.status(statusCode).render('error',{ err })
})

const port = process.env.PORT || 3000;
// getting-started server
app.listen(port,() =>{
    console.log(`Serving on port ${port}`)
})


