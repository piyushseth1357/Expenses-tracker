const express = require('express');
const router = express.Router();
const { getBudgets, setBudget, deleteBudget } = require('../controllers/budgetController');
const { verifyToken } = require('../middleware/auth');

router.use(verifyToken);

router.get('/', getBudgets);
router.post('/', setBudget);
router.delete('/:id', deleteBudget);

module.exports = router;
