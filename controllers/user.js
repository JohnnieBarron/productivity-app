const express = require('express');
const router = express.Router();

// Middleware used to protect routes that need a logged in user
const ensureLoggedIn = require('../middleware/ensure-logged-in');

// This is how we can more easily protect ALL routes for this router
router.use(ensureLoggedIn);

// ALL paths start with '/user'

// index action
//routes to profile home page
router.get('/index', (req, res) => {
  res.render('user/index.ejs');
});

// GET /user/new
// Example of a protected route
router.get('/new', (req, res) => {
  res.send('Create a unicorn!');
});

module.exports = router;