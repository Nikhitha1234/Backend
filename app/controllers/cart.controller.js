const Cart = require('../models/cart.model.js');

exports.create = (req, res) => {
    // Validate request
    if(!req.body.User) {
        return res.status(400).send({
            message: "User name can not be empty"
        });
    }

    // Create a Cart
    const cart = new Cart({
        User : req.body.User,
        Items : [{
            MenuID: req.body.MenuID,
            Quantity: req.body.Quantity
        }]
    });

    // Save Cart in the database
    cart.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while adding Cart Item."
        });
    });
};


exports.update = (req, res) => {
    // Validate request
    if(!req.body.User) {
        return res.status(400).send({
            message: "User name can not be empty"
        });
    }



    Cart.findOneAndUpdate({User:req.body.User},
        {
            $push : {
                Items :  {
                    MenuID: req.body.MenuID,
                    Quantity: req.body.Quantity
                }
            }
        },
        { new: true })
        .then(data => {
        res.send(data);
}).catch(err => {
        res.status(500).send({
        message: err.message || "Some error occurred while adding Cart Item."
    });
});

};


exports.findOne = (req, res) => {
    Cart.find({User:req.params.User})
    .then(cart => {
        if(!cart) {
            return res.status(404).send({
                message: "No user found " 
            });            
        }
        res.send(cart);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "No user found " 
            });                
        }
        return res.status(500).send({
            message: "Error retrieving user " 
        });
    });
};

//Favorite.update( {cn: req.params.name}, { $pullAll: {uid: [req.params.deleteUid] }

exports.removeMenu = (req, res) => {
    // Validate request
    if(!req.params.User) {
    return res.status(400).send({
        message: "User name can not be empty"
    });
}



Cart.findOneAndUpdate({User:req.params.User},
    {
        $pull : {
            Items :  {
                MenuID: req.params.MenuID
            }
        }
    },
    { new: true })
    .then(data => {
    res.send(data);
}).catch(err => {
    res.status(500).send({
    message: err.message || "Some error occurred while adding Cart Item."
});
});

};

exports.delete = (req, res) => {
    Cart.find({User:req.params.User,MenuID:req.params.MenuID}).remove().exec()
    .then(cart => {
        if(!cart) {
            return res.status(404).send({
                message: "User or Menu ID not found " 
            });
        }
        res.send({message: "Cart item deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "User or Menu ID not found  "
            });                
        }
        return res.status(500).send({
            message: "Could not delete item "
        });
    });
};
