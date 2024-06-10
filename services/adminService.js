const albumRepository = require('../repositories/albumRepository');

class AlbumService {
    async getAlbums(filters = {}) {
        const albums = await albumRepository.findAll(filters);
        return albums.map(album => ({
            album_id: album.album_id,
            name: album.name,
            created_at: album.created_at,
            user_name: album.user.name,
            user_id: album.user_id,
            likes: album.likes,
            photo_count: album.photos.length,
            thumbnails: album.photos.slice(0, 4).map(photo => `/api/uploads/thumb/${album.album_id}/${photo.thumb_url}`)
        }));
    }

    async createAlbum(albumData) {
        return await albumRepository.create(albumData);
    }

    async getAlbumById(album_id) {
        return await albumRepository.findById(album_id);
    }
    async likeAlbum(album_id) {
        const album = await albumRepository.findById(album_id);
        if (album) {
            album.likes += 1;
            await album.save();
            return album.likes;
        }
        throw new Error('Album not found');
    }
    async updateAlbum(album_id, name) {
        const album = await albumRepository.findById(album_id);
        if (album) {
            album.name = name;
            await album.save();
            return album;
        }
        return null;
    }

    async deleteAlbum(album_id) {
        const albumWithPhotos = await albumRepository.findAlbumWithPhotos(album_id);
        if (albumWithPhotos) {
            for (const photo of albumWithPhotos.photos) {
                await photo.destroy();
            }
            await albumWithPhotos.album.destroy();
            return true;
        }
        return false;
    }

    async getAlbumDetails(album_id) {
        const album = await albumRepository.findAlbumWithPhotos(album_id);
        return {
            album_id: album.album.album_id,
            name: album.album.name,
            created_at: album.album.created_at,
            likes: album.likes,
            user_name: album.album.user.name,
            photo_count: album.photos.length,
            thumbnails: album.photos.slice(0, 4).map(photo => `/api/uploads/thumb/${album.album.album_id}/${photo.thumb_url}`)
        };
    }
}

module.exports = new AlbumService();
