var ProductObj = require('../models/products.js');

exports.saveProduct = function(req, res) {
        /*var product = new ProductObj({
        	'category': req.body.category,
        	'name': req.body.name,
            'totalQuantity': req.body.quantity,
            'image': req.body.imageUrl
        });*/

        console.log(req.body);
        var product = req.body;
        product.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Product saved!' });
        });
        
    };

exports.getAllProducts = function(req, res) {
        ProductObj.find(function(err, products) {
            if (err)
                res.send(err);

            res.json(products);
        });
    };

exports.getProduct = function(req, res) {
        ProductObj.findById(req.params.product_id, function(err, product) {
            if (err)
                res.send(err);
            res.json(product);
        });
    };

exports.updateProduct = function(req, res) {

        ProductObj.findById(req.params.product_id, function(err, product) {

            if (err)
                res.send(err);

            product = req.body;

            // save the bear
            product.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'Product updated!' });
            });

        });
    };


exports.deleteProduct = function(req, res) {
	    ProductObj.remove({
	        _id: req.params.user_id
	    }, function(err, bear) {
	        if (err)
	            res.send(err);

	        res.json({ message: 'Successfully deleted' });
	    });
	};
