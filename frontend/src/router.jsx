import { createBrowserRouter } from 'react-router-dom';
import Home from './pages/Home/Home';
import System from './pages/System/System';
import Equipment from './pages/Equipment/Equipment';
import Character from './pages/Character/Character';
import Dice from './pages/Dice/Dice';
import Map from './pages/Map/Map';

const router = createBrowserRouter([
    { path: '/', element: <Home /> },
    { path: '/system', element: <System /> },
    { path: '/equipment', element: <Equipment /> },
    { path: '/character', element: <Character /> },
    { path: '/dice', element: <Dice /> },
    { path: '/map', element: <Map /> },
]);

export default router;
