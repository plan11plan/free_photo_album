const Photo = require('../domain/Photo');

class PhotoRepository {


    async findByFileNameAndAlbumId(fileName, albumId) {
        return await Photo.findOne({ where: { file_name: fileName, album_id: albumId } });
    }
    async findAllByAlbumId(album_id) {
        return await Photo.findAll({ where: { album_id } });
    }

    async create(photoData) {
        return await Photo.create(photoData);
    }

    async findById(photo_id) {
        return await Photo.findByPk(photo_id);
    }

    async deleteById(photo_id) {
        const photo = await Photo.findByPk(photo_id);
        if (photo) {
            await photo.destroy();
            return true;
        }
        return false;
    }
}

module.exports = new PhotoRepository();
