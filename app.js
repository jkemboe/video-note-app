const express = require('express')
const path = require('path')
const port = process.env.PORT || 3000
const exphbs  = require('express-handlebars') 
const methodOverride = require('method-override')
const flash = require('connect-flash')
const session = require('express-session')
const bodyParser = require('body-parser')
const passport = require('passport')
const mongoose = require('mongoose')

const app = express()

//load routes
const ideas = require('./routes/ideas')
const users = require('./routes/users')

//DB CONFIG
const db = require('./config/database')

//passport config
require('./config/passport')(passport)

//connect to mongoose db
mongoose.connect(db.mongoURI,{
    useNewUrlParser: true
}).then(() => {console.log('MongoDB Connected...')}).catch((e) => {console.log(e)})

//handlebar middleware  
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//Static folder
app.use(express.static(path.join(__dirname, 'public')))

//method-override middleware
app.use(methodOverride('_method'))

//Express session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  }))

  //PASSPORT MIDDLEWARE
app.use(passport.initialize());
app.use(passport.session());

app.use(flash())

//Global variables
app.use(function(req,res,next){
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    res.locals.user = req.user || null
    next()
})

//express middleware
app.use(function(req, res, next) {
    req.name = 'Joseph'
    next()
})


//HOME DIR
app.get('/', (req, res) => {
    const title = 'Title | Maasai'
    res.render('index', {
        title: title,
    })
})

//ABOUT PAGE
app.get('/about', (req, res) => {
    res.render('about')
})



//use routes
app.use('/ideas', ideas)
app.use('/users', users)

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})