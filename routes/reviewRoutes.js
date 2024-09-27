const express = require('express');

const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route('/')
  .get(authController.protect, reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo('user'),

    //Allow nested route
    reviewController.setTourUserIds,
    reviewController.createReview,
  );

router
  .route('/:id')
  .get(authController.protect, reviewController.getReview)
  .patch(
    authController.protect,
    authController.restrictTo('user', 'admin'),
    reviewController.updateReview,
  )
  .delete(
    authController.protect,
    authController.restrictTo('user', 'admin'),
    reviewController.deleteReview,
  );

module.exports = router;
