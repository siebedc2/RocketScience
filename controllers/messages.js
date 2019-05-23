const Message =   require('../models/Message');

const getAll = (req, res) => {
    Message.find({ }, (err, docs) => {
        if(!err) {
            res.json({
                "status": "success",
                "data": {
                    "messages": docs
                },
                "currentUser": req.user.username
            });
        }
    })
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
    let user = req.user.username;
    let messageId = req.params.id;
    let newMessage = req.body.text;
    

    Message.findOneAndUpdate({
        user: user,
        _id: messageId
    }, {
        text: newMessage
    }, {new: true}).then(doc => {
        res.json({
            "status": "success",
            "data": {
                "message": doc
            }
        })       
    }).catch(err => {
        res.json(err);
    })
}

const remove = (req, res) => {
    let user = req.user.username;
    let messageId = req.params.id;

    Message.findOneAndDelete({
        user: user,
        _id: messageId
    }).then(result => {
        res.json({
            "status": "success",
            "message": "deleted " + messageId,
            "id": messageId
        })
    }).catch(err => {
        res.json(err);
    })
}

module.exports.getAll = getAll;
module.exports.getId = getId;
module.exports.create = create;
module.exports.put = put;
module.exports.remove = remove;