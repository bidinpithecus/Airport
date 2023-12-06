import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Airplane } from './pages/airplane';
import { Home } from './pages/home';
import { Staff } from './pages/staff';
import { Technician } from './pages/technician';
import { NewModel } from './pages/new-airplane-model';
import { NewAirplane } from './pages/new-airplane';
import axios from 'axios';
import React from 'react';
import { NewTechnicianPro } from './pages/new-technician-pro';
import NewTechnician from './pages/new-technician';
import NewTest from './pages/new-test';

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
		path: '/airplaneModel',
		element: <NewModel />,
	},
	{
		path: '/airplane/:id',
		element: <Airplane />,
	},
	{
		path: '/airplane',
		element: <NewAirplane />,
	},
	{
		path: '/airplanes',
		element: <Airplane />,
	},
	{
		path: '/technician/:id',
		element: <Technician />,
	},
	{
		path: '/technician_pro/',
		element: <NewTechnicianPro />,
	},
	{
		path: '/technician/',
		element: <NewTechnician />,
	},
	{
		path: '/test/',
		element: <NewTest />,
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
