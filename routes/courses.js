const express = require('express');
const { getCourses,getCourse,addCourse,updateCourse,deleteCourse } = require('../controllers/courses');

const Course = require('../models/Course');
const advancedResults = require('../middleware/advancedResults');

const router = express.Router({ mergeParams: true });

router.route('/')
    .get(
        advancedResults(Course, {
        path: 'bootcamp',
        select: 'name description'
        }),
        getCourses
    )
    .post(addCourse);//Reroute coming from Bootcamps routes

router.route('/:id')
    .get(getCourse)
    .post(addCourse)
    .put(updateCourse)
    .delete(deleteCourse);

module.exports = router;