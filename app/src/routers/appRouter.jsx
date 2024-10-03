import { Navigate, createBrowserRouter } from 'react-router-dom';
import App from '../components/App/App';
import pages from '../pages';
import logic from '../logic';

const routes = [
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Navigate to={logic.isUserLoggedIn() ? '/home' : '/login'} replace />,
      },
      {
        path: 'home',
        element: <pages.Home />,
      },
      {
        path: 'login',
        element: <pages.Login />,
      },
      {
        path: 'register',
        element: <pages.Register />,
      },
      {
        path: '*',
        element: <pages.NotFound />,
      },
    ],
  },
];

const appRouter = createBrowserRouter(routes);

export default appRouter;
