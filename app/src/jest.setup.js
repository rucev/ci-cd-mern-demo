import { server } from './mocks/node';
import '@testing-library/jest-dom';


beforeAll(() => {
    server.listen();
});

afterEach(() => {
    server.resetHandlers();
    sessionStorage.clear();
});

afterAll(() => {
    server.close();
});