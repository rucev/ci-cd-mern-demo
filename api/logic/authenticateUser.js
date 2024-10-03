const { User } = require('../data/models');
const { errors: { AuthError, ExistenceError } } = require('common');
const {
    validators: { validateEmail, validatePassword },
} = require('common');
const bcrypt = require('bcryptjs');

/**
 * Verifies the credentials of a user
 * 
 * @param {string} email The user email
 * @param {string} password The user password
 * 
 * @returns {string} User id
 */

module.exports = (email, password) => {
    validateEmail(email);
    validatePassword(password);

    return (async () => {
        const user = await User.findOne({ email });
        if (!user) throw new ExistenceError('user not found');
        const match = await bcrypt.compare(password, user.password);
        if (!match) throw new AuthError('wrong credentials');

        return user.id;
    })();
};
