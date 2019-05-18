const express =             require('express');
const router =  express.Router();
const messageController =   require('../controllers/messages');

// get all messages
router.get("/", messageController.getAll);

// get messages with id
router.get("/:id", messageController.getId);

// create a message
router.post("/", messageController.create);

// update a message
router.put(":id", messageController.put);

// delete a message
router.delete(":id", messageController.remove);


module.exports = router;