import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Root from './Component/Layout/Root';
import Login from './Component/Auth/Login';
import Dashboard from './Component/Page/Dashboard';
import axios from 'axios';
import User from './Component/Page/User/User';
import Admin from './Component/Page/Admin/Admin';
import ProtectedUserRoute from './Component/Auth/ProtectedUserRoute';
import ProtectedAdminRoute from './Component/Auth/ProtectedAdminRoute';
import { useStore } from 'react-redux';

function App() {
  
  axios.defaults.baseURL='http://localhost:8070/'
  
  const router = createBrowserRouter([
    {//sử dụng ProtectRoute 
      path: '/',
      element: 
      <Root />,
      errorElement:<div>403</div>,
      children:[
        {
          path:'/',
          element:<Dashboard/>
        },
        {
          path:'/user',
          element:<ProtectedAdminRoute role="USER"><User/></ProtectedAdminRoute>
        },
        {
          path:'/admin',
          element:<ProtectedAdminRoute role="ADMIN"><Admin/></ProtectedAdminRoute>
        }
      ]
    },
    {
      path: '/login',
      element: <Login/>
    }
  ])
  return (
    <RouterProvider router={router}/>
  );

}

export default App;
