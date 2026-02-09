const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const { auth, authorize } = require('../middleware/auth');

router.get('/my-account', auth, authorize('user'), accountController.getAccount);
router.get('/all', auth, authorize('admin', 'superadmin'), accountController.getAllAccounts);
router.put('/status', auth, authorize('admin', 'superadmin'), accountController.updateAccountStatus);

module.exports = router;
