/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable prettier/prettier */
const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

const { getAllUsers, getUser, createUser, updateUser, deleteUser } =
  userController;

router.post('/signup', authController.signUp);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// Protect all routes after this middleware
router.use(authController.protect);

router.patch('/updateMyPassword', authController.updatePassword);

// router.get('/confirmEmail/:token', authController.confirmEmail);

router.get('/me', userController.getMe, getUser);
router.patch(
  '/updateMe',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe,
);
router.delete('/deleteMe', userController.deleteMe);

router.use(authController.restrictTo('admin'));
router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
