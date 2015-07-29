
var User = require('../models/user');

var Story = require('../models/story');

var config = require('../../config');

var secretKey = config.secretKey;

var jsonwebtoken = require('jsonwebtoken');

function createToken(user){
    var token = jsonwebtoken.sign({
        id: user._id,
        name: user.name,
        username: user.username
    }, secretKey, {
        expirtesInMinute: 1440

    });
    return token;
}

module.exports = function(app, express, io){

    //Before Passing middleware

    var api = express.Router();

    api.get('/all_stories', function(req, res){
        Story.find({}, function(err, stories){

            if(err){
                res.send(err);
                return;
            }

            res.json(stories);

        });

    });

    api.post('/signup', function(req, res){   //User signup API post to database

        var user = new User({
            name: req.body.name,
            username: req.body.username,
            password: req.body.password
        });

        var token  = createToken(user);

        user.save(function(err){

            if(err){
                res.send(err);
                return;
            }
            res.json({
                success: true,
                message: 'User has been created',
                token: token

            });
        });
    });

    api.get('/users', function(req, res){  //Get Use API, find is a mongoose method which will find all the users in the database
        User.find({}, function(err, users){
            if (err) {
                res.send(err);
                return;
            } 
            res.json(users);
        });
    });
    // two approach of creating login API, 1. Cookie Approach - common approach - this is not scalable - sessions for each users created. 
    //2. Token based authentication approach which is a modern approach - scalable - we are going to use this one

    api.post('/login', function(req, res){
        User.findOne({
            username: req.body.username
        }).select('name username password').exec(function(err, user){

            if(err) throw err;
            if(!user){
                res.send({message: "User Doesn't Exist"});
            }else if(user){
                var validPassword = user.comparePassword(req.body.password);

                if(!validPassword){
                    res.send({message: "Invalid Password"});
                }
                else{
                    //create a token//
                    var token  = createToken(user);
                    res.json({
                        success: true,
                        message: "Logged In Successfully!",
                        token: token
                    });
                }
            }

        });

    });

    //middleware
//Middleware for token verification//
api.use(function(req, res, next){

    console.log("Somebody was here");

    var token = req.body.token || req.param('token') || req.headers['x-access-token'];

    //check if token exist
    if(token){
        jsonwebtoken.verify(token, secretKey, function(err, decoded){
            if(err){
                res.status(403).send({ success: false, message: "Failed to authenticate Token"});
            }else{
                req.decoded = decoded;

                next();
            }
        })
    }
    else{
        res.status(403).send({ success: false, message: "Token not provided"});
    }

});

//After Passing Middleware//
// api.get('/', function(req, res){

//     res.json("Hi There!!!");

// });


//Multiple HTTP request on a single route - chaining method
api.route('/')
  
.post(function(req, res){
    var story = new Story({

        creator: req.decoded.id,
        content: req.body.content

    });

    story.save(function(err, newStory){

        if(err){
            res.send(err);
            return;
        }
        io.emit('story', newStory)
        res.json({message: "New events Created!!"});

    });

})     //don't add ';' here otherwise the chaining will not work


.get(function(req, res){

    Story.find({ creator: req.decoded.id}, function(err, stories){

        if(err){
            res.send(err);
            return;
        }

        res.json(stories);

    });

});


//api to decode user information

api.get('/me', function(req, res){
    res.json(req.decoded);
})


return api;
}