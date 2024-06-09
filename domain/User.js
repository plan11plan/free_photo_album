const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/config');

const User = sequelize.define('user', {
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    created_at: DataTypes.DATE,
    login_at: DataTypes.DATE,
    role: {
        type: DataTypes.STRING,
        defaultValue: 'user' // 기본값을 'user'로 설정
    }
}, {
    timestamps: false
});

module.exports = User;
