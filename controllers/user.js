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
  res.render('user/index.ejs', { goals,  });
});


// clicked new goal render goal.ejs
router.get('/new', (req, res) => {
  // set different route for first goal and regular goal creation
  res.render('user/goal/firstGoal.ejs');
});

//index page for goals
router.get('/goalsIndex', async (req, res) => {
  const goals = await Goal.find({ user: req.user._id });
  res.render('user/goals/index.ejs', { goals });
});


// render form for new task
router.get('/newTask', (req, res) => {
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