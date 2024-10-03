const { registerUser } = require('../logic');
const { handleErrors } = require('./helpers');

/**
 * Route handler for registering a new user.
 *
 * @param {Object} req The request object.
 * @param {Object} res The response object.
 * @returns {Promise} A Promise that resolves after successfully registering the user.
 * @throws {Error} If there is an error while registering the user or handling errors.
 */
module.exports = handleErrors((req, res) => {
    const { email, password } = req.body;
    return registerUser(email, password).then(() => res.status(204).send());
})
