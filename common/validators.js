const errors = require('./errors.js')

const validateEmail = (email) => {
  if (typeof email !== 'string') throw new TypeError('email is not a string');
  if (!email.trim().length) throw new errors.ContentError('email is empty');
  const regexRule = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  if (!regexRule.test(email)) throw new errors.FormatError('email format is not valid');
};

const validatePassword = (password) => {
  if (typeof password !== 'string') throw new TypeError('password is not a string');
  if (!password.trim().length) throw new errors.ContentError('password is empty');
  if (password.length < 4) throw new RangeError('password length lower than 4 characters');
}

const validateRepeatPassword = (password, repeatPassword) => {
  validatePassword(password);
  validatePassword(repeatPassword);
  if (password !== repeatPassword) throw new errors.DuplicityError('password and confirmation password are different');
};

const validateId = (id, explain) => {
  if (typeof id !== 'string') throw new TypeError(`${explain} is not a string`);
  if (!id.trim().length) throw new errors.ContentError(`${explain} is empty`);
}

module.exports = {
  validateEmail,
  validatePassword,
  validateRepeatPassword,
  validateId
}