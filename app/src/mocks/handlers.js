import { http, HttpResponse } from 'msw';
import { usersMock } from './usersMock';

const apiUrl = import.meta.env.VITE_API_URL;

export const handlers = [
  http.post(`${apiUrl}/users`, ({ body }) => {
    const { email, password } = body;

    const existingUser = usersMock.find(user => user.email === email);
    if (existingUser) {
      return HttpResponse.error();
    }

    const newUser = { email, password };
    usersMock.push(newUser);

    return HttpResponse.json(newUser, { status: 201 });
  }),
  http.post(`${apiUrl}/users/auth`, ({ body }) => {
    const { email, password } = body;

    const user = usersMock.find((user) => user.email === email);

    if (user && user.password === password) return HttpResponse.json(email);
    else return HttpResponse.error();

  }),

  http.get(`${apiUrl}/users`, ({ headers }) => {
    const authHeader = headers.get('Authorization');

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];

      const user = usersMock.find((user) => user.email === token);


      if (user) {
        return HttpResponse.json({ email: user.email }, { status: 200 });
      } else {
        return HttpResponse(null, { status: 401 });
      }
    } else {
      return HttpResponse(null, { status: 401 });
    }
  }),
];

