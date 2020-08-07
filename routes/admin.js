var express = require('express');

var router  = express.Router();

let path = require('path')

var multer = require('multer')

const withAuth = require('../middleware/middleware');

const STORAGE1 = multer.diskStorage({
    destination: path.join(__dirname + './../public/images/foto-mahasiswa/'),
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const UPLOADPROFILE = multer({
    storage: STORAGE1
});

const adminController = require('../controllers/adminController');

// Roles
router.get('/roles',withAuth,adminController.getDataRoleUser);
router.post('/roles/tambah',withAuth,adminController.insertDataRoleUser);

// Users
router.get('/users',withAuth,adminController.getDataUser);
router.post('/users/tambah',withAuth,adminController.insertDataUser);
router.patch('/users/update',withAuth,adminController.updateDataUser);
router.delete('/users/hapus/:id',withAuth,adminController.deleteDataUser);

// Magang
router.get('/magang',withAuth,adminController.getDataMagang);
router.post('/magang/tambah',withAuth,adminController.insertDataMagang);
router.delete('/magang/hapus/:id',withAuth,adminController.deleteDataMagang);
router.patch('/magang/update',withAuth,adminController.updateDataMagang);
router.post('/magang/reset',withAuth,adminController.resetPassword);
//Pengaturan WFH
router.post('/pengaturan/tambah',withAuth,adminController.insertPengaturanWFH);
router.get('/pengaturan',withAuth,adminController.getPengaturanWFH);

//Home
router.get('/universitas',withAuth,adminController.getUniversitas);
router.get('/belumabsen',withAuth,adminController.getMagangBelumAbsen);
// Manajemen data
router.get('/laporan',withAuth,adminController.getLaporanHarianMagang);
router.delete('/laporan/hapus/:id',withAuth,adminController.deleteLaporan);
module.exports = router;
