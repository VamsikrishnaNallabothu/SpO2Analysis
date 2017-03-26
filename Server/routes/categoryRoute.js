var CategoryObj= require('../models/categories.js');

exports.saveCategory = function(req, res) {
        var category = new CategoryObj({
        	'name': req.body.name,
        	'imageUrl': req.body.imageUrl
        });

        category.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Category saved!' });
        });
        
    };

exports.getAllCategories = function(req, res) {
        CategoryObj.find(function(err, categories) {
            if (err)
                res.send(err);

            res.json(categories);
        });
    };

exports.getCategory = function(req, res) {
        CategoryObj.findById(req.params.category_id, function(err, category) {
            if (err)
                res.send(err);
            res.json(category);
        });
    };

exports.updateCategory = function(req, res) {

        CategoryObj.findById(req.params.category_id, function(err, category) {

            if (err)
                res.send(err);

            category = req.body;

            // save the bear
            category.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'Category updated!' });
            });

        });
    };


exports.deleteCategory = function(req, res) {
	    CategoryObj.remove({
	        _id: req.params.user_id
	    }, function(err, category) {
	        if (err)
	            res.send(err);

	        res.json({ message: 'Successfully deleted' });
	    });
	};
