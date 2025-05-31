const express = require('express');
const router = express.Router();
const Goal = require('../models/goals');
const dayGridPlugin = require('@fullcalendar/daygrid')
// Middleware used to protect routes that need a logged in user
const ensureLoggedIn = require('../middleware/ensure-logged-in');

// This is how we can more easily protect ALL routes for this router
router.use(ensureLoggedIn);

