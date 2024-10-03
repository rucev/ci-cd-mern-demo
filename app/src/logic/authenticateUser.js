import { validators, errors } from 'common';
import context from './context'

const { validateEmail, validatePassword } = validators;

/**
 * Authenticates a user by email and password
 * 
 * @param {string} user The user's email
 * @param {string} password The user's password
 * 
 * @returns {string} The user's id
 */

export default (email, password) => {
  validateEmail(email);
  validatePassword(password);

  const credentials = { email, password }

  return (async () => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/users/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    })

    if (response.status === 200) {
      const token = await response.json()
      context.token = token;
      return;
    }

    throw new errors.AuthError('password / email not correct')
  })()
}

