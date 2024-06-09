require('dotenv').config();
const { Sequelize } = require('sequelize');
const path = require('path');
const User = require('../domain/User'); // User 모델 추가

class Database {
    constructor() {
        this.sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
            host: process.env.DB_HOST,
            dialect: process.env.DB_DIALECT || 'mysql', // 명시적으로 dialect 옵션 추가
        });

        this.paths = {
            original: path.join(__dirname, '../uploads/original'),
            thumb: path.join(__dirname, '../uploads/thumb')
        };
    }

    async sync() {
        try {
            await this.sequelize.sync({ alter: true }); // alter: true 옵션 사용
            console.log('Database & tables created/updated!');

            // 어드민 유저 생성 확인 및 생성
            const adminUser = await User.findOne({ where: { email: 'admin@gmail.com' } });
            if (!adminUser) {
                await User.create({
                    name: 'admin',
                    email: 'admin@gmail.com',
                    password: 'admin', // 평문 비밀번호 저장
                    role: 'admin' // role 컬럼을 추가해서 'admin'으로 설정
                });
                console.log('Admin user created!');
            } else {
                console.log('Admin user already exists!');
            }
        } catch (err) {
            console.log('Error: ' + err);
        }
    }
}

module.exports = new Database();
