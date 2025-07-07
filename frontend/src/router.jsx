import { createBrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import System from './pages/System';
import Equipment from './pages/Equipment';
import Character from './pages/Character';
import Dice from './pages/Dice';
import Map from './pages/Map';

const router = createBrowserRouter([
    { path: '/', element: <Home /> },
    { path: '/system', element: <System /> },
    { path: '/equipment', element: <Equipment /> },
    { path: '/character', element: <Character /> },
    { path: '/dice', element: <Dice /> },
    { path: '/map', element: <Map /> },
]);

export default router;
