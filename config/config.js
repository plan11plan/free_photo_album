require('dotenv').config();
const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || 'mysql',
});

const paths = {
    original: path.join(__dirname, '../uploads/original'),
    thumb: path.join(__dirname, '../uploads/thumb')
};

const sync = async () => {
    try {
        await sequelize.sync({ alter: true });
        console.log('Database & tables created/updated!');
    } catch (err) {
        console.log('Error: ' + err);
    }
};

module.exports = {
    sequelize,
    paths,
    sync
};
