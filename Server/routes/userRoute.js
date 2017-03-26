var UserObj = require('../models/users.js');

exports.saveUser = function(req, res) {
        var user = new UserObj({
            'userId': req.body.userId,
        	'email': req.body.email,
            'name': req.body.name,
            'age': req.body.age
        });

        user.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'User created!' });
        });
        
    };

exports.getAllUsers = function(req, res) {
        UserObj.find(function(err, users) {
            if (err)
                res.send(err);

            res.json(users);
        });
    };

exports.getUser = function(req, res) {
        console.log(req.query.userId);
        UserObj.find({'userId':req.query.userId}, function(err, user) {
            if (err)
                res.send(err);
            console.log(user);
            res.send(user[0]);
        });
    };

exports.updateUser = function(req, res) {

        UserObj.find({'userId':req.body.userId}, function(err, users) {
            var user = users[0];
            if (err)
                res.send(err);

            user.name = req.body.name;
            user.age= req.body.age
            // save the bear
            user.save(function(err) {
                if (err)
                    res.send(err);

                res.json({'userId':user.userId, 'name':user.name, 'age': user.age, 'email': user.email});
            });

        });
    };


exports.deleteUser = function(req, res) {
	    UserObj.remove({
	        _id: req.params.user_id
	    }, function(err, bear) {
	        if (err)
	            res.send(err);

	        res.json({ message: 'Successfully deleted' });
	    });
	};
