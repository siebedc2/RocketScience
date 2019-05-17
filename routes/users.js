const express =          require('express');
const router = express.Router();
const authController =   require('../controllers/auth');

/* GET users listing. */
router.get('/signup', (req, res) => {
  res.render('signup');
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/signup', authController.signup);
router.post('/login', authController.login);

module.exports = router;
