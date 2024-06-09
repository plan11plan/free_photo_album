const albumService = require('../services/albumService');

exports.getAlbums = async (req, res) => {
    const { name, author } = req.query;
    try {
        const albums = await albumService.getAlbums({ name, author });
        res.status(200).json(albums);
    } catch (error) {
        console.error('Error fetching albums:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.getAlbumDetails = async (req, res) => {
    const { album_id } = req.params;
    try {
        const result = await albumService.getAlbumDetails(album_id);
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: 'Album not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createAlbum = async (req, res) => {
    const { name } = req.body;
    const user_id = req.user.user_id; // JWT에서 추출한 user_id 사용
    try {
        const album = await albumService.createAlbum({ name, user_id, created_at: new Date() });
        res.status(201).json(album);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.likeAlbum = async (req, res) => {
    const { album_id } = req.body;
    if (!album_id) {
        return res.status(400).json({ error: 'Album ID is required.' });
    }
    try {
        const likes = await albumService.likeAlbum(album_id);
        res.status(200).json({ likes });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateAlbum = async (req, res) => {
    const { album_id, name } = req.body;
    const user_id = req.user.user_id; // JWT에서 추출한 user_id 사용
    try {
        const album = await albumService.getAlbumById(album_id);
        if (album && album.user_id === user_id) {
            const updatedAlbum = await albumService.updateAlbum(album_id, name);
            res.status(200).json(updatedAlbum);
        } else {
            res.status(403).json({ message: 'Forbidden: You can only update your own albums' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteAlbum = async (req, res) => {
    const { album_id } = req.body;
    const user_id = req.user.user_id; // JWT에서 추출한 user_id 사용
    try {
        const album = await albumService.getAlbumById(album_id);
        if (album && album.user_id === user_id) {
            const success = await albumService.deleteAlbum(album_id);
            if (success) {
                res.status(200).json({ message: 'Album deleted' });
            } else {
                res.status(404).json({ message: 'Album not found' });
            }
        } else {
            res.status(403).json({ message: 'Forbidden: You can only delete your own albums' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
