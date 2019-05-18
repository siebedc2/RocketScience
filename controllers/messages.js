const Message =   require('../models/Message');

const getAll = (req, res) => {
    if(req.query.user) {
        let username = req.query.user;

        Message.find({ "user": username }, (err, docs) => {
            if(!err){
                res.json({
                    "status": "success",
                    "data": {
                        "messages": docs
                    }
                });
            }
        })
    }

    else {
        Message.find({ }, (err, docs) => {
            if(!err) {
                res.json({
                    "status": "success",
                    "data": {
                        "messages": docs
                    }
                });
            }
        })
    }    
}

const getId = (req, res) => {
    let id = req.params.id;

    res.json({
        "status": "success",
        "message": "getting a message with id " + id
    });
}

const create = (req, res, next) => {
    let message = new Message();
    message.text = req.body.text;

    console.log(req.user);

    message.user = req.user.username;
    message.save( (err, doc) => {
        if (err){
            res.json({
                "status": "error",
                "message": "Could not save this message"
            });
        }

        if(!err) {
            res.json({
                "status": "success",
                "data": {
                    "message": doc
                }
            });
        }
    })
}

const put = (req, res) => {
    let id = req.params.id;

    res.json({
        "status": "success",
        "message": "updating a message with id " + id
    });

}

const remove = (req, res) => {
    let id = req.params.id;

    res.json({
        "status": "success",
        "message": "deleting a message with id " + id
    });
}

module.exports.getAll = getAll;
module.exports.getId = getId;
module.exports.create = create;
module.exports.put = put;
module.exports.remove = remove;