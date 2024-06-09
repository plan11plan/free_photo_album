const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || 'your_secret_key';

const authenticateJWT = (req, res, next) => {
    if (req.method === 'GET') {
        return next(); // GET 요청은 누구나 접근할 수 있도록 허용
    }

    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, secret, (err, user) => {
            if (err) {
                console.log('JWT verification failed:', err); // 디버그 로그 추가
                return res.status(403).json({ message: 'Invalid token' }); // JWT 검증 실패 시 403 에러 반환
            }
            req.user = user;
            next();
        });
    } else {
        console.log('No JWT token provided'); // 디버그 로그 추가
        res.status(401).json({ message: 'No token provided' }); // JWT가 없을 시 401 에러 반환
    }
};

module.exports = authenticateJWT;
