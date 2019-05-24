const express =                require('express');
const router = express.Router();
const authController =         require('../controllers/auth');

/* GET users listing. */
router.get('/signup', (req, res) => {
  res.render('signup');
});

router.get('/login', (req, res) => {
  res.render('login');
});

/*router.get('/profile', (req, res) => {
  res.render('profile');
});*/

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/profile', authController.getProfile);

module.exports = router;
