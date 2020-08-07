const express = require('express');

const router  = express.Router();

let path = require('path')

const multer = require('multer')

const withAuth = require('../middleware/middleware');

const magangController = require('../controllers/magangController');

//absensi
router.post('/absenpagi',withAuth,magangController.insertAbsenPagi);
router.patch('/absenpulang',withAuth,magangController.updateAbsenPulang);
router.get('/magang_info/:id',withAuth,magangController.getInfoUser);
//History
router.get('/history/:id',withAuth,magangController.getInfoRiwayatAbsen);
router.post('/download/:id',withAuth,magangController.getDownloadLaporan);
//Ubah password
router.post('/ubahpassword',withAuth,magangController.updatePasswordMagang);
module.exports = router;
