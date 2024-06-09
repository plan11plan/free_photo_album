const express = require('express');
const multer = require('multer');
const photoController = require('../controllers/photoController');
const authenticateJWT = require('../middlewares/auth'); // 올바른 경로로 수정
const router = express.Router();
const upload = multer(); // multer 미들웨어 정의

router.get('/:album_id', photoController.getPhotos);
router.get('/details/:photo_id', photoController.getPhotoDetails); // 인증 없이 사진 상세 정보 조회 가능
router.delete('/', authenticateJWT, photoController.deletePhoto); // JWT 인증 추가
router.post('/:album_id', authenticateJWT, upload.array('photos'), photoController.uploadPhotos); // JWT 인증 추가
router.get('/download/:photo_id', photoController.downloadPhoto); // 다운로드 엔드포인트 추가

module.exports = router;
