const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/config');
const Album = require('./Album'); // Album 모델을 먼저 불러옵니다.

const Photo = sequelize.define('photo', {
    photo_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    file_name: DataTypes.STRING,
    thumb_url: DataTypes.STRING,
    original_url: DataTypes.STRING,
    file_size: DataTypes.INTEGER,
    uploaded_at: DataTypes.DATE,
    album_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Album,
            key: 'album_id'
        }
    }
}, {
    timestamps: false
});

module.exports = Photo;
