const User = require('../models/user');





module.exports.renderRegister = (req,res) =>{
    res.render('users/register')
}

module.exports.register = async(req,res,next) =>{
    try{
        const {username,email,password} = req.body;
        const user = new User ({username,email});

        //To connect the user with password we use the register method on passport
        const registeredUser = await  User.register(user,password);

        //To login the user we use the login method on passport
        req.login(registeredUser,err=>{
            if(err) return next(err)
            req.flash('success','Welcome to Yelp Camp!');
            res.redirect('/campgrounds');
        })
    } catch (e) {
        req.flash('error',e.message)
        return res.redirect('/register')
    }
    
}

module.exports.renderLogin = (req,res) =>{
    res.render('users/login');
}

module.exports.login = (req,res) =>{
    req.flash('success', 'welcome back!');

    //To redirect to the pre wanted Url
    const redirectUrl = req.session.returnTo|| '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl); 
}

module.exports.logout = (req,res) =>{
    req.logout(()=>{
        req.flash('success' , 'Goodbye!');
        res.redirect('campgrounds');
    });
}