var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var connection  = require('express-myconnection');
var oauthserver = require('oauth2-server');

var routes = require('./routes/index');
var users = require('./routes/user');

var app = express();



app.oauth = oauthserver({
  model: {
    getAccessToken : function(bearerToken, callback){
        callback(null,{
            accessToken : 'validtoken',
            clientId : 'clientId',
            expires : '900000',
            userId : 1
        });
        done();
    },
    getClient : function(clientId, clientSecret, callback){   
        callback(null, {
            clientId : clientId,
            clientSecret : clientSecret
        });
    },
    getRefreshToken : function(bearerToken, callback){
        callback(null, {refreshToken : 'refreshToken'});
        done();
    },
    grantTypeAllowed : function(clientId, grantType, callback){        
        return callback(false,true);
    },
    saveAccessToken : function(accessToken, clientId, expires, userId, callback){
        callback(null);       
    },
    saveRefreshToken : function(refreshToken, clientId, expires, userId, callback){
        callback(null);        
    },
    getUser : function(username, password, callback){       
        callback(false, {
            id : 1,
            name : 'leury'
        });
    }
  }, // See below for specification
  grants: ['password'],
  debug: true
});



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// app.use(favicon(__dirname + '/public/img/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(  
    connection(mysql,{
        host: 'localhost',
        user: 'root',
        password : 'root',
        port : 3306,
        database:'mpf'
    },'request')
);


app.all('/oauth/token', app.oauth.grant());

app.use(app.oauth.errorHandler());

//app.use('/', routes);
//app.use('/users', users);

app.get('/', app.oauth.authorise(), function (req, res) {
  res.send('Secret area');
});

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            title: 'error'
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        title: 'error'
    });
});


module.exports = app;