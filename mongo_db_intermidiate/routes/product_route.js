const express = require('express');
const {insertSampleProducts, getProductStats, getProductAnalysis} = require('../controller/product_controller');

const router = express.Router();

router.post('/insert', insertSampleProducts)
router.get('/stats', getProductStats)
router.get('/analysis', getProductAnalysis)

module.exports = router;