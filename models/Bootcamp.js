const mongoose = require('mongoose');
const slugify = require('slugify');
const geocoder = require('../utils/geocoder');

const BootcampSchema = new mongoose.Schema({
  name: {
    type: String,
    // required: [true, 'Please add a name'],
    required: [true, 'Por favor agregue un nombre'],
    unique: true,
    trim: true,
    // maxlength: [50, 'Name can not be more than 50 characters']
    maxlength: [50, 'El nombre no puede tener mas de 50 caracteres']
  },
  slug: String,
  description: {
    type: String,
    // required: [true, 'Please add a description'],
    // maxlength: [500, 'Description can not be more than 500 characters']
    required: [true, 'Por favor agregue una decripcion'],
    maxlength: [500, 'La descripcion no puede tener mas de 500 caracteres']
  },
  website: {
    type: String,
    // match: [
    //   /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
    //   'Please use a valid URL with HTTP or HTTPS'
    // ]
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      'Por favor ingrese una URL valida con HTTP o HTTPS'
    ]
  },
  phone: {
    type: String,
    // maxlength: [20, 'Phone number can not be longer than 20 characters']
    maxlength: [20, 'El telefono no puede tener mas de 20 caracteres']
  },
  email: {
    type: String,
    // match: [
    //   /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    //   'Please add a valid email'
    // ]
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,'Por favor ingrese un email valido']
  },
  address: {
    type: String,
    // required: [true, 'Please add an address']
    required: [true, 'Por favor ingrese una direccion valida']
  },
  location: {
    // GeoJSON Point
    type: {
      type: String,
      enum: ['Point'],
      required: false
    },
    coordinates: {
      type: [Number],
      required: false,
      index: '2dsphere'
    },
    formattedAddress: String,
    street: String,
    city: String,
    state: String,
    zipcode: String,
    country: String
  },
  careers: {
    // Array of strings
    type: [String],
    required: true,
    enum: [
      'Web Development',
      'Mobile Development',
      'UI/UX',
      'Data Science',
      'Business',
      'Other'
    ]
  },
  averageRating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [10, 'Rating must can not be more than 10']
  },
  averageCost: Number,
  photo: {
    type: String,
    default: 'no-photo.jpg'
  },
  housing: {
    type: Boolean,
    default: false
  },
  jobAssistance: {
    type: Boolean,
    default: false
  },
  jobGuarantee: {
    type: Boolean,
    default: false
  },
  acceptGi: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Cascade delete courses when a bootcamp is deleted
BootcampSchema.pre('remove', async function(next) {
  console.log(`Courses being removed from bootcamp ${this._id}`);
  await this.model('Course').deleteMany({ bootcamp: this._id });
  next();
});

// Reverse populate with virtuals, in order to get related courses of a Bootcamp
BootcampSchema.virtual('courses' /* Field name */, {
  ref: 'Course',
  localField: '_id',
  foreignField: 'bootcamp', //Same name declared as a field in Course Model
  justOne: false
});

// Create bootcamp slug from the name
BootcampSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// Geocode & create location field
// BootcampSchema.pre('save', async function(next) {
//   const loc = await geocoder.geocode(this.address);
//   this.location = {
//     type: 'Point',
//     coordinates: [loc[0].longitude, loc[0].latitude],
//     formattedAddress: loc[0].formattedAddress,
//     street: loc[0].streetName,
//     city: loc[0].city,
//     state: loc[0].stateCode,
//     zipcode: loc[0].zipcode,
//     country: loc[0].countryCode
//   };

//   // Do not save address in DB
//   this.address = undefined;
//   next();
// });

module.exports = mongoose.model('Bootcamp', BootcampSchema);