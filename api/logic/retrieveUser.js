const {
    validators: { validateId },
    errors: { ExistenceError }
} = require('common');
const { User } = require('../data/models');

/**
 * Retrieve's a user display data
 * 
 * @param {string} userId The user id
 * 
 * @returns {string} user email
 */

module.exports = (userId) => {
    validateId(userId, 'userId');

    return (async () => {
        const user = await User.findById(userId, 'email').lean();
        if (!user) throw new ExistenceError('user not found');

        return user.email;
    })()
}