const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/config');
const User = require('./User'); // User 모델을 먼저 불러옵니다.

const Album = sequelize.define('album', {
    album_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: DataTypes.STRING,
    created_at: DataTypes.DATE,
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'user_id'
        }
    },
    likes: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, {
    timestamps: false
});

module.exports = Album;
