const photoService = require('../services/photoService');
const albumService = require('../services/albumService');
const path = require('path');

exports.getPhotos = async (req, res) => {
    const { album_id } = req.params;
    try {
        const photos = await photoService.getPhotos(album_id);
        res.status(200).json(photos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.uploadPhotos = async (req, res) => {
    const { album_id } = req.params;
    const user_id = req.user.user_id;

    try {
        const album = await albumService.getAlbumById(album_id);
        if (!album || album.user_id !== user_id) {
            return res.status(403).json({ message: 'Forbidden: You can only upload photos to your own albums' });
        }

        const files = req.files;
        const photos = await Promise.all(files.map(file => photoService.savePhoto(file, album_id)));
        const photoPaths = photos.map(photo => ({
            original_url: photo.original_url,
            thumb_url: photo.thumb_url
        }));
        res.status(201).json(photoPaths);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getPhotoDetails = async (req, res) => {
    const { photo_id } = req.params;
    try {
        const photo = await photoService.getPhotoDetails(photo_id);
        if (photo) {
            res.status(200).json(photo);
        } else {
            res.status(404).json({ message: 'Photo not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deletePhoto = async (req, res) => {
    const { photo_id } = req.body;
    const user_id = req.user.user_id;

    try {
        const photo = await photoService.getPhotoDetails(photo_id);
        const album = await albumService.getAlbumById(photo.album_id);
        if (!photo || album.user_id !== user_id) {
            return res.status(403).json({ message: 'Forbidden: You can only delete your own photos' });
        }

        const success = await photoService.deletePhoto(photo_id);
        if (success) {
            res.status(200).json({ message: 'Photo deleted' });
        } else {
            res.status(404).json({ message: 'Photo not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.downloadPhoto = async (req, res) => {
    const { photo_id } = req.params;
    try {
        const photo = await photoService.getPhotoDetails(photo_id);
        if (photo) {
            const filePath = path.join(__dirname, '..', 'uploads', 'original', photo.album_id.toString(), photo.file_name);
            res.download(filePath, photo.file_name);
        } else {
            res.status(404).json({ message: 'Photo not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
