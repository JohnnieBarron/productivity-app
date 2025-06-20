const express = require('express');
const router = express.Router();
const Goal = require('../models/goals');
const dayGridPlugin = require('@fullcalendar/daygrid')
// Middleware used to protect routes that need a logged in user
const ensureLoggedIn = require('../middleware/ensure-logged-in');

// This is how we can more easily protect ALL routes for this router
router.use(ensureLoggedIn);

// ALL paths start with '/user'
// index action
//routes to profile home page
router.get('/index', async (req, res) => {
  const goals = await Goal.find({ user: req.user._id });
  
  const tasks = goals.flatMap(goal => 
    goal.task.map(task => ({
      title: task.title,
      start: task.start.toISOString(),
      end: task.end.toISOString(),
      allDay: task.allDay,
      isCompleted: task.isCompleted,
      repeats: task.repeats,
      repeatDuration: task.repeatDuration,
      notes: task.notes,
      location: task.location,
    }))
  );

  res.render('user/index.ejs', { goals, tasks, dayGridPlugin });
});


// clicked new goal render goal.ejs
router.get('/new', (req, res) => {
  // TODO set different route for first goal and regular goal creation
  res.render('user/goals/firstGoal.ejs');
});

//index page for goals
router.get('/goalsIndex', async (req, res) => {
  const goals = await Goal.find({ user: req.user._id });
  res.render('user/goals/index.ejs', { goals });
});

// delete goal
router.delete('/goals/:id', async (req, res) => {
    await Goal.findByIdAndDelete(req.params.id);
    res.redirect('/user/index'); 
});


// render form for new task
router.get('/newTask', async (req, res) => {
  const goals = await Goal.find({ user: req.user._id });
  res.render('user/task/new.ejs', { goals });
});

// catch the new task and post it
const dayjs = require('dayjs');

router.post('/newTask', async (req, res) => {
  try {
    const goal = await Goal.findById(req.body.goalId);

    const {
      title,
      start,
      end,
      allDay,
      repeats,
      repeatDuration,
      notes,
      location,
      repeatUntil,
      weekdaysOnly
    } = req.body;

    const startDate = new Date(start);
    const endDate = new Date(end);
    const repeat = repeats === 'on';
    const untilDate = repeatUntil ? new Date(repeatUntil) : null;
    const weekdays = weekdaysOnly === 'on';

    const createTask = (s, e) => ({
      title,
      start: s,
      end: e,
      allDay: allDay === 'on',
      isCompleted: false,
      repeats: repeat,
      repeatDuration: repeat ? repeatDuration : null,
      notes: notes || '',
      location: location || ''
    });

    goal.task.push(createTask(startDate, endDate));

    if (repeat && repeatDuration && untilDate) {
      let current = dayjs(startDate);
      const originalDuration = dayjs(endDate).diff(dayjs(startDate), 'minute');

      while (true) {
        if (repeatDuration === 'daily') {
          current = current.add(1, 'day');
        } else if (repeatDuration === 'weekly') {
          current = current.add(1, 'week');
        } else if (repeatDuration === 'monthly') {
          current = current.add(1, 'month');
        }

        if (current.toDate() > untilDate) break;

        // Skip weekends if "Weekdays only" is checked
        if (weekdays && [0, 6].includes(current.day())) continue;

        const newStart = current.toDate();
        const newEnd = dayjs(newStart).add(originalDuration, 'minute').toDate();

        goal.task.push(createTask(newStart, newEnd));
      }
    }

    await goal.save();
    res.redirect('/user/index');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to create task.');
  }
});



// response to edit task button
router.get('/task/:id/edit', async (req, res) => {
    const taskId = req.params.id;
    const goals = await Goal.find({ user: req.user._id }); //NOTE all goals for looping
    const goal = await Goal.findOne({ 'task._id': taskId, user: req.user._id });
    const task = goal.task.find(t => t._id.toString() === taskId);

    res.render('user/task/edit.ejs', { task, goal, goals });
});

//send the edit updates to DB
router.put('/tasks/:id', async (req, res) => {
  const taskId = req.params.id;
  const goal = await Goal.findOne({ 'task._id': taskId, user: req.user._id });
  const task = goal.task.id(taskId);
  Object.assign(task, req.body);
  await goal.save();
  res.redirect('/user/task/index');
});


// Delete task
router.delete('/task/:id', async (req, res) => {
    const taskId = req.params.id;
    const goal = await Goal.findOne({ 'task._id': taskId });
    goal.task = goal.task.filter(task => task._id.toString() !== taskId);
    await goal.save();
    res.redirect('/user/task/index'); 
});

// catch the submission new goal
router.post('/', async (req, res) => {
     const newGoal = new Goal({
      name: req.body.name,
      Type: req.body.Type,
      user: req.user._id
     });
  await newGoal.save();
  
  res.redirect('/user/index');
});

// render Task manager route
router.get('/task/index', async (req, res) => {
  const goals = await Goal.find({ user: req.user._id });
  res.render('user/task/index.ejs', { goals });
});


// Mark a task as completed
router.post('/tasks/:taskId/complete', async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const goal = await Goal.findOne({ 'task._id': taskId, user: req.user._id });

    if (!goal) {
      return res.status(404).send('Goal or task not found');
    }

    const task = goal.task.id(taskId);
    if (!task) {
      return res.status(404).send('Task not found');
    }

    task.isCompleted = true;

    await goal.save();

    res.redirect('/user/task/index');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});






module.exports = router;