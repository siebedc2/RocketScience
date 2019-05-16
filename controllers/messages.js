const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const messageSchema = new Schema ({
    text: {
        type: String,
        required: true
    },
    user: String
})
const Message = mongoose.model('Message', messageSchema);

const getAll = (req, res) => {
    Message.find({ }, (err, docs) => {
        if(!err) {
            res.json({
                "status": "success",
                "data": {
                    "todos": docs
                }
            });
        }
    })    
}

const create = (req, res, next) => {
    let message = new Message();
    //message.text = "Test Message";
    message.user = "Siebe";
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
                    "todo":{
                        "text": doc
                    }
                }
            });
        }
    })
}

module.exports.getAll = getAll;
module.exports.create = create;