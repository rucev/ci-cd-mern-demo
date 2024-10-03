import { render, screen, waitFor } from '@testing-library/react';
import Register from './Register';
import wrapWithRouter from '../utils/testUtils';

describe('Given a Register Page component', () => {
    const route = [
        {
            path: '/register',
            element: <Register />,
        },
    ];

    describe(`When it's rendered`, () => {
        test('Then it should show the register form', async () => {
            const { element } = wrapWithRouter(route, ['/register']);

            render(element);

            const heading = await waitFor(() =>
                screen.getByRole('heading', {
                    name: 'Register',
                    level: 2,
                })
            );

            const emailInput = screen.getByPlaceholderText(`your email`);
            const passwordInput = screen.getByPlaceholderText(`your password`);
            const confirmPasswordInput = screen.getByPlaceholderText(`confirm your password`);
            const submitButton = screen.getByText('create user');
            const changeViewLink = screen.getByText('Sign in');

            expect(heading).toBeInTheDocument();
            expect(emailInput).toBeInTheDocument();
            expect(passwordInput).toBeInTheDocument();
            expect(confirmPasswordInput).toBeInTheDocument();
            expect(submitButton).toBeInTheDocument();
            expect(changeViewLink).toBeInTheDocument();
        });
    });

});
