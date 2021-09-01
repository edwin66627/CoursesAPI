const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    // required: [true, 'Please add a course title']
    required: [true, 'Por favor agregue el titulo']
  },
  description: {
    type: String,
    // required: [true, 'Please add a description']
    required: [true, 'Por favor agregue una descripcion']
  },
  weeks: {
    type: String,
    // required: [true, 'Please add number of weeks']
    required: [true, 'Please agregue un numero de semanas']
  },
  tuition: {
    type: Number,
    // required: [true, 'Please add a tuition cost']
    required: [true, 'Por favor agregue un costo de matricula']
  },
  minimumSkill: {
    type: String,
    // required: [true, 'Please add a minimum skill'],
    // enum: ['beginner', 'intermediate', 'advanced']
    required: [true, 'Por favor seleccione un minimo de habilidades'],
    enum: ['Principiante', 'Intermedio', 'Avanzado']
  },
  scholarshipAvailable: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  /* Courses are related to a Bootcamp */
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: 'Bootcamp',
    required: true
  }
});

// Static method to get avg of course tuitions
CourseSchema.statics.getAverageCost = async function(bootcampId) {
  console.log('Calculating avg cost...'.blue);

  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId }
    },
    {
      $group: {
        _id: '$bootcamp',
        averageCost: { $avg: '$tuition' }
      }
    }
  ]);

  try {
    await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
      averageCost: Math.ceil(obj[0].averageCost / 10) * 10
    });
  } catch (err) {
    console.error(err);
  }
};

// Call getAverageCost after save
CourseSchema.post('save', function() {
  this.constructor.getAverageCost(this.bootcamp);
});

// Call getAverageCost before remove
CourseSchema.pre('remove', function() {
  this.constructor.getAverageCost(this.bootcamp);
});


module.exports = mongoose.model('Course', CourseSchema);