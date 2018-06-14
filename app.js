const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const expressValidator = require('express-validator');
const mongoose = require('mongoose');

//Mongoose Connect
mongoose.connect('mongodb://localhost/sportsblog');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('we are connected');
});
//init app
const app = express();

//port 
const port = 4000;

const index = require('./routes/index');
const articles = require('./routes/articles');
const categories = require('./routes/categories');
const manage = require('./routes/manage');


//View Setup 
app.set('views', path.join(__dirname,'views'));
app.set('view engine','pug');

//Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

//Set static folder
app.use(express.static(path.join(__dirname,'public')));

// Moment
app.locals.moment = require('moment');

app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true
}));

//Express Messages
app.use(require('connect-flash')());
app.use((req, res, next) => {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//Express validator
app.use(expressValidator({
	errorFormatter: (param, msg, value) => {
		const namespace = param.split('.')
		, root = namespace.shift()
		, formParam = root;

	  while(namespace.length){
	    	formParam += '[' + namespace.shift() + ']';
	  }
	  return {
	    param : formParam,
	    msg : msg,
	    value : value
	  };
	}
}));


app.use('/',index);
app.use('/articles', articles);
app.use('/categories', categories);
app.use('/manage', manage);

app.listen(port,()=>{
	console.log('Server started on port'+port);
})