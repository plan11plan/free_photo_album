const User = require('../domain/User');

class UserRepository {
    async create(userData) {
        return await User.create(userData);
    }

    async findByEmail(email) {
        return await User.findOne({ where: { email } });
    }

    async findAll() {
        return await User.findAll();
    }

    async deleteById(user_id) {
        const user = await User.findByPk(user_id);
        if (user) {
            await user.destroy();
            return true;
        }
        return false;
    }
}

module.exports = new UserRepository();
