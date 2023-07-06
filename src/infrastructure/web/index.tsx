import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HomePage } from './pages/homePage';
import { CGRAPage } from './pages/cgraPage';
import { RouterProvider, createHashRouter } from 'react-router-dom';

const router = createHashRouter([
    {
        path: '/',
        element: <HomePage />,
    },
    {
        path: '/cgra',
        element: <CGRAPage />,
    },
]);

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>,
);
