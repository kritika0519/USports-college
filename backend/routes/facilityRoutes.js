const express = require('express');
const router = express.Router();
const facilityController = require('../controllers/facilityController');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/', facilityController.getFacilities);
router.post('/add', auth, adminOnly, facilityController.addFacility);
router.get('/all', auth, adminOnly, facilityController.getAllFacilities);
router.delete('/:facilityId', auth, adminOnly, facilityController.deleteFacility);

module.exports = router;
