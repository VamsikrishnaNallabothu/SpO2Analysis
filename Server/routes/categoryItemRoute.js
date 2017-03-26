var CategoryItemObj= require('../models/categoryItems.js');

exports.saveCategoryItem = function(req, res) {
        var categoryItem = new CategoryItemObj({
        	'name': req.body.name,
        	'imageUrl': req.body.imageUrl,
            'price': req.body.price,
            'quantityRemaining': req.body.quantityRemaining,
            'categoryId': req.body.categoryId,
            'categoryName': req.body.categoryName
        });

        categoryItem.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Category item saved!' });
        });
        
    };

exports.getAllCategoryItems = function(req, res) {
        CategoryItemObj.find(function(err, categoryItems) {
            if (err)
                res.send(err);

            res.json(categoryItems);
        });
    };

exports.getCategoryItems = function(req, res) {
        console.log(req.query);
        CategoryItemObj.find({'categoryId':req.query.categoryId}, function(err, items) {

            if (err)
                res.send(err);
            res.json(items);
        });
    };

exports.updateCategory = function(req, res) {

        CategoryItemObj.find(req.params.categoryId, function(err, categoryItem) {

            if (err)
                res.send(err);

            categoryItem.quantityRemaining = req.body.quantityRemaining;

            // save the bear
            categoryItem.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'Category item updated!' });
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
