import { render, screen, waitFor } from '@testing-library/react';
import NotFound from './NotFound';
import wrapWithRouter from '../utils/testUtils';

describe('Given a NotFound Page component', () => {
    const route = [
        {
            path: '/thisdoesnotexist',
            element: <NotFound />,
        },
    ];

    describe(`When it's rendered`, () => {
        test('Then it should show the notfound page', async () => {
            const { element } = wrapWithRouter(route, ['/thisdoesnotexist']);

            render(element);

            const heading = await waitFor(() =>
                screen.getByRole('heading', {
                    name: '404: Page Not Found',
                    level: 2,
                })
            );

            expect(heading).toBeInTheDocument();
        });
    });

});
