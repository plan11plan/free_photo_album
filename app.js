require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const { sequelize, sync } = require('./config/config');
const { exec } = require('child_process');

// MySQL Docker 컨테이너 시작
exec('docker start mysql_container || docker run --name mysql_container -e MYSQL_ROOT_PASSWORD=1234 -e MYSQL_DATABASE=photo_album -p 3306:3306 -d mysql:8.0', (err, stdout, stderr) => {
    if (err) {
        console.error(`Error starting MySQL container: ${err}`);
        return;
    }
    console.log(`MySQL container started: ${stdout}`);
    console.error(`MySQL container stderr: ${stderr}`);
});

// Import routes
const userRoutes = require('./routes/userRoutes');
const albumRoutes = require('./routes/albumRoutes');
const photoRoutes = require('./routes/photoRoutes');
const adminRoutes = require('./routes/adminRoutes'); // 추가

// Import models
const User = require('./domain/User');
const Album = require('./domain/Album');
const Photo = require('./domain/Photo');

const app = express();

// CORS 설정
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(bodyParser.json());

// Static file serving
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/css', express.static(path.join(__dirname, 'view/css')));
app.use('/js', express.static(path.join(__dirname, 'view/js')));
app.use('/html', express.static(path.join(__dirname, 'view/html')));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/albums', albumRoutes);
app.use('/api/photos', photoRoutes);
app.use('/api/admin', adminRoutes); // 추가

// Redirect root to homePage
app.get('/', (req, res) => {
    res.redirect('/homePage');
});

// Home page route
app.get('/homePage', (req, res) => {
    res.sendFile(path.join(__dirname, 'view/html/homePage.html'));
});

// Album page route
app.get('/albumPage', (req, res) => {
    res.sendFile(path.join(__dirname, 'view/html/albumPage.html'));
});

// Admin login page route
app.get('/adminLogin', (req, res) => {
    res.sendFile('/Users/jins/Desktop/life/project/donga/photo_share/api/view/html/adminLogin.html');
});

// Admin manage page route
app.get('/adminManage', (req, res) => {
    res.sendFile('/Users/jins/Desktop/life/project/donga/photo_share/api/view/html/adminManage.html');
});

// Sync database and start server
(async () => {
    // 모델 관계 설정
    User.hasMany(Album, { foreignKey: 'user_id' });
    Album.belongsTo(User, { foreignKey: 'user_id' });
    Album.hasMany(Photo, { foreignKey: 'album_id' });
    Photo.belongsTo(Album, { foreignKey: 'album_id' });

    await sync();
    const server = app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });

    // 서버 종료 시 MySQL Docker 컨테이너 중지
    process.on('SIGINT', () => {
        exec('docker stop mysql_container', (err, stdout, stderr) => {
            if (err) {
                console.error(`Error stopping MySQL container: ${err}`);
            }
            console.log(`MySQL container stopped: ${stdout}`);
            console.error(`MySQL container stderr: ${stderr}`);
            process.exit();
        });
    });
})();

module.exports = app;
