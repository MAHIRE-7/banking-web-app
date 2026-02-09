const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth, authorize } = require('../middleware/auth');

router.get('/', auth, authorize('admin', 'superadmin'), userController.getAllUsers);
router.post('/employee', auth, authorize('superadmin'), userController.createEmployee);
router.put('/status', auth, authorize('superadmin'), userController.updateUserStatus);
router.delete('/:userId', auth, authorize('superadmin'), userController.deleteUser);

module.exports = router;
