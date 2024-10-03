import context from './context'

/**
 * Retrieve's the data of an user by the token
 * 
 * @returns a user email
*/

export default async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        'Authorization': `Bearer ${context.token}`
      }
    });

    if (response.status !== 200) {
      const { error } = await response.json();
      throw new Error(error);
    }

    return await response.json();
  } catch (error) {
    throw new Error(`Fetch error: ${error.message}`);
  }
};

