const express = require('express');
const albumController = require('../controllers/albumController');
const authenticateJWT = require('../middlewares/auth'); // 경로 수정
const router = express.Router();

router.post('/', authenticateJWT, albumController.createAlbum);
router.put('/', authenticateJWT, albumController.updateAlbum);
router.delete('/', authenticateJWT, albumController.deleteAlbum);
router.get('/', albumController.getAlbums);
router.get('/:album_id', albumController.getAlbumDetails); // 인증 없이 앨범 조회 가능
router.post('/like', albumController.likeAlbum);

module.exports = router;
