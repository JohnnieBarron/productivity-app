const express = require('express');
const router = express.Router();
const Goal = require('../models/goals');

// Middleware used to protect routes that need a logged in user
const ensureLoggedIn = require('../middleware/ensure-logged-in');

// This is how we can more easily protect ALL routes for this router
router.use(ensureLoggedIn);

// ALL paths start with '/user'

// index action
//routes to profile home page
router.get('/index', async (req, res) => {
  const goals = await Goal.find({ user: req.user._id });
  res.render('user/index.ejs', { goals });
});


// clicked new goal render goal.ejs
router.get('/new', (req, res) => {
  res.render('user/firstGoal.ejs');
});

// catch the submission
router.post('/', async (req, res) => {
     const newGoal = new Goal({
      name: req.body.name,
      Type: req.body.Type,
      user: req.user._id
     });
  await newGoal.save();

  res.redirect('/user/index');
});




module.exports = router;