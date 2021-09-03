const express = require('express');
const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  bootcampPhotoUpload
} = require('../controllers/bootcamps');

const Bootcamp = require('../models/Bootcamp');
const advancedResults = require('../middleware/advancedResults');

// Include other resource routers
const courseRouter = require('./courses');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.route('/:id/photo').put(protect, authorize('publisher', 'admin'), bootcampPhotoUpload);

// Re-route request into other resource routers
router.use('/:id/courses', courseRouter);

router
  .route('/')
  .get(advancedResults(Bootcamp, 'courses'), getBootcamps)
  .post(protect, authorize('publisher', 'admin'),createBootcamp);

router
  .route('/:id')
  .get(getBootcamp)
  .put(protect, authorize('publisher', 'admin'),updateBootcamp)
  .delete(protect, authorize('publisher', 'admin'),deleteBootcamp);

module.exports = router;