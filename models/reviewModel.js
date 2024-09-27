const mongoose = require('mongoose');
const Tour = require('./tourModel');

const { Schema, model } = mongoose;

const reviewSchema = new Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty!'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: { type: Date, default: Date.now(), select: false },
    tour: {
      type: Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour.'],
    },
    user: {
      type: Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  //   // "this" points to the current query
  //   this.populate({
  //     path: 'tour',
  //     select: 'name',
  //   }).populate({
  //     path: 'user',
  //     select: 'name photo',
  //   });

  this.populate({
    path: 'user',
    select: 'name photo',
  });

  next();
});

reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  if (stats.length > 0)
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats.at(0).nRating,
      ratingsAverage: stats.at(0).avgRating,
    });
  else
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
};

reviewSchema.post('save', function () {
  // this point to current review
  this.constructor.calcAverageRatings(this.tour);
});

// TO UPDATE THE TOUR DOCUMENT WHENEVER A REVIEW IS UPDATED OR DELETED
// findByIdAndUpdate
// findByIdAndDelete

// // Solution 1
// reviewSchema.pre(/^findOneAnd/, async function (next) {
//   // 1) Assign the review document (r) as a new property on the query (this), query.findOne() returns the current document being queried
//   this.r = await this.findOne();

//   next();
// });

// reviewSchema.post(/^findOneAnd/, async function (next) {
//   // 2) Then we can then access the static function through the model, which is accessed through the review document and through the review document wee can access the tourId (this.r.tour)
//   // await this.findOne(); does not work here, query has already executed
//   await this.r.constructor.calcAverageRatings(this.r.tour);
// });

// Solution 2 (Better solution)
reviewSchema.post(/^findOneAnd/, async function (doc) {
  // doc points to the current review either been updated or deleted
  await doc.constructor.calcAverageRatings(doc.tour);
});

const Review = model('Review', reviewSchema);

module.exports = Review;
