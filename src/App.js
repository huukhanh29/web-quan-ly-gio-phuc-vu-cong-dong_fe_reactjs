import './App.css';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import Root from './Component/Layout/Root';
import Login from './Component/Auth/Login';
import User from './Component/Page/User/User';
import Admin from './Component/Page/Admin/Admin';
import ProtectedRoute from './Component/Auth/ProtectedRoute';
import Home from './Component/Page/Home';
import ProtectedAuthRoute from './Component/Auth/ProtectedAuthRoute';
import 
SendFeedback from './Component/Page/User/FeedBack/SendFeedback';
import ListFeedback from './Component/Page/User/FeedBack/ListFeedback';

function App() {
  const router = createBrowserRouter([
    {//sử dụng ProtectRoute 
      path: '/',
      element:
        <ProtectedRoute><Root /></ProtectedRoute>,
      errorElement: <div>404</div>,
      children: [
        {
          path: '/',
          element: <Home />
        },
        {
          path: '/user',
          element: <ProtectedAuthRoute role="USER">
            <Outlet />
          </ProtectedAuthRoute>,
          children:[
            {
              path: '',
              element: <User/>
            },
            {
              path: 'send-feedback',
              element: <SendFeedback />
            },
            {
              path: 'list-feedback',
              element: <ListFeedback />
            }
          ]
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
