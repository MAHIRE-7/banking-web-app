const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const { auth, authorize } = require('../middleware/auth');

router.post('/', auth, authorize('user'), transactionController.createTransaction);
router.get('/my-transactions', auth, authorize('user'), transactionController.getTransactions);
router.get('/all', auth, authorize('admin', 'superadmin'), transactionController.getAllTransactions);
router.get('/flagged', auth, authorize('admin', 'superadmin'), transactionController.getFlaggedTransactions);

module.exports = router;
