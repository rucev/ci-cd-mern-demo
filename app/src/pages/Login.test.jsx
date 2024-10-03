import { render, screen, waitFor } from '@testing-library/react';
import Login from './Login';
import wrapWithRouter from '../utils/testUtils';

describe('Given a Login Page component', () => {
    const route = [
        {
            path: '/login',
            element: <Login />,
        },
    ];

    describe(`When it's rendered`, () => {
        test('Then it should show the login form', async () => {
            const { element } = wrapWithRouter(route, ['/login']);

            render(element);

            const heading = await waitFor(() =>
                screen.getByRole('heading', {
                    name: 'Login',
                    level: 2,
                })
            );

            const emailInput = screen.getByPlaceholderText(`your email`);
            const passwordInput = screen.getByPlaceholderText(`your password`);
            const submitButton = screen.getByText('sign in');
            const changeViewLink = screen.getByText('Sign up');

            expect(heading).toBeInTheDocument();
            expect(emailInput).toBeInTheDocument();
            expect(passwordInput).toBeInTheDocument();
            expect(submitButton).toBeInTheDocument();
            expect(changeViewLink).toBeInTheDocument();
        });
    });

});
