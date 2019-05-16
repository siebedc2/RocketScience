const express = require('express');
const router = express.Router();

router.get("/", (req, res) => {
    res.json({
        "status": "success",
        "data": {
            "todos": []
        }
    });
});

router.post("/", (req, res) => {
    res.json({
        "status": "success",
        "data": {
            "todo":{
                "text": "Learn Node.js"
            }
        }
    });
});


module.exports = router;