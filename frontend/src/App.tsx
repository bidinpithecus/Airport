import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Airplane } from './pages/airplane';
import { Home } from './pages/home';
import { Staff } from './pages/staff';
import axios from 'axios';

export const api = axios.create({
	baseURL: "http://0.0.0.0:8080/api"
});

const router = createBrowserRouter([
	{
		path: '/',
		element: <Home />,
	},
	{
		path: '/staff',
		element: <Staff />,
	},
	{
		path: '/airplane',
		element: <Airplane />,
	},
	{
		path: '*',
		element: <div>not found</div>,
	},
]);

function App() {
	return <RouterProvider router={router} />;
}

export default App;
