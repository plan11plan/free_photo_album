const { Op } = require('sequelize');
const Album = require('../domain/Album');
const Photo = require('../domain/Photo');
const User = require('../domain/User');

class AlbumRepository {
    async findAll(filters = {}) {
        const where = {};
        if (filters.name) {
            where.name = { [Op.like]: `%${filters.name}%` };
        }

        const include = [
            {
                model: User,
                attributes: ['name'],
                as: 'user',
                where: {},
            },
            {
                model: Photo,
                attributes: ['photo_id'],
                as: 'photos'
            }
        ];

        if (filters.author) {
            include[0].where.name = { [Op.like]: `%${filters.author}%` };
        }

        return await Album.findAll({
            where,
            include
        });
    }

    async create(albumData) {
        return await Album.create(albumData);
    }

    async findById(album_id) {
        return await Album.findByPk(album_id, {
            include: [
                {
                    model: User,
                    attributes: ['name'],
                    as: 'user'
                },
                {
                    model: Photo,
                    attributes: ['photo_id', 'thumb_url'],
                    as: 'photos',
                    limit: 4,
                    order: [['uploaded_at', 'DESC']]
                }
            ]
        });
    }

    async deleteById(album_id) {
        const album = await Album.findByPk(album_id);
        if (album) {
            await album.destroy();
            return true;
        }
        return false;
    }

    async findAlbumWithPhotos(album_id) {
        const album = await Album.findByPk(album_id, {
            include: [
                {
                    model: User,
                    attributes: ['name'],
                    as: 'user'
                },
                {
                    model: Photo,
                    attributes: ['photo_id', 'thumb_url'],
                    as: 'photos'
                }
            ]
        });
        if (album) {
            const photos = await Photo.findAll({ where: { album_id } });
            return { album, photos };
        }
        return null;
    }
}

module.exports = new AlbumRepository();
