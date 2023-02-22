import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Root from './Component/Layout/Root';
import Login from './Component/Auth/Login';
import axios from 'axios';
import User from './Component/Page/User/User';
import Admin from './Component/Page/Admin/Admin';
import ProtectedRoute from './Component/Auth/ProtectedRoute';
import Home from './Component/Page/Home';
import ProtectedAuthRoute from './Component/Auth/ProtectedAuthRoute';

function App() {

  axios.defaults.baseURL = 'http://localhost:8070/'

  const router = createBrowserRouter([
    {//sử dụng ProtectRoute 
      path: '/',
      element:
        <ProtectedRoute><Root /></ProtectedRoute>,
      errorElement: <div>403</div>,
      children: [
        {
          path: '/',
          element: <Home />
        },
        {
          path: '/user',
          element: <ProtectedAuthRoute role="USER"><User/></ProtectedAuthRoute>
        },
        {
          path: '/admin',
          element: <ProtectedAuthRoute role="ADMIN"><Admin/></ProtectedAuthRoute>
        }
      ]
    },
    {
      path: '/login',
      element: <Login />
    }
  ])
  return (
    <RouterProvider router={router} />
  );

}

export default App;
