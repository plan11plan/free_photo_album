const userService = require('../services/userService');
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || 'your_secret_key';

exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const user = await userService.register({ name, email, password, created_at: new Date() });
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userService.login(email, password);
        if (user) {
            user.login_at = new Date();
            await user.save();

            // JWT 발급
            const token = jwt.sign({ user_id: user.user_id, email: user.email }, secret, { expiresIn: '1h' });
            res.status(200).json({ user, token });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
