const userRepository = require('../repositories/userRepository');

class UserService {
    async register(userData) {
        const existingUser = await userRepository.findByEmail(userData.email);
        if (existingUser) {
            throw new Error('Email already exists');
        }
        return await userRepository.create(userData);
    }

    async login(email, password) {
        const user = await userRepository.findByEmail(email);
        if (user && user.password === password) {
            return user;
        } else {
            throw new Error('Invalid email or password');
        }
    }

    async getAllUsers() {
        return await userRepository.findAll();
    }

    async deleteUser(user_id) {
        return await userRepository.deleteById(user_id);
    }
}

module.exports = new UserService();
