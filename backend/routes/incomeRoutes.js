const express = require('express');
const router = express.Router();
const { getIncomes, addIncome, updateIncome, deleteIncome } = require('../controllers/incomeController');
const { verifyToken } = require('../middleware/auth');

router.use(verifyToken);

router.get('/', getIncomes);
router.post('/', addIncome);
router.put('/:id', updateIncome);
router.delete('/:id', deleteIncome);

module.exports = router;
