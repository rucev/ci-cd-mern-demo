const { User } = require('../data/models');
const { errors: { DuplicityError, UnknownError } } = require('common');
const {
    validators: { validateEmail, validatePassword },
} = require('common');
const bcrypt = require('bcryptjs');

/**
 * Creates a new user
 * 
 * @param {string} email The user email
 * @param {string} password The user password
 */

module.exports = (email, password) => {
    validateEmail(email);
    validatePassword(password);

    return (async () => {
        try {
            const cryptPassword = await bcrypt.hash(password, 10);

            await User.create({
                email,
                password: cryptPassword,
            });

        } catch (error) {
            if (error.message.includes('E11000'))
                throw new DuplicityError(`user with email ${email} already exists`)

            throw new UnknownError(error.message)
        }
    })();
}