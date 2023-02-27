import './App.css';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import Root from './Component/Layout/Root';
import Login from './Component/Auth/Login';
import Admin from './Component/Page/Admin/Admin';
import ProtectedRoute from './Component/Auth/ProtectedRoute';
import Home from './Component/Page/Home';
import ProtectedAuthRoute from './Component/Auth/ProtectedAuthRoute';
import SendFeedback from './Component/Page/Student/FeedBack/SendFeedback';
import ListFeedback from './Component/Page/Student/FeedBack/ListFeedback';
import Lecturer from './Component/Page/Lecturer/Lecturer';
import Student from './Component/Page/Student/Student';
import Page403 from './Component/Page/403/403';
import ListFaq from './Component/Page/Admin/Faq/ListFaq';

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
          path: '/student',
          element: <ProtectedAuthRoute role="STUDENT">
            <Outlet />
          </ProtectedAuthRoute>,
          children:[
            {
              path: '',
              element: <Student/>
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
          element: <ProtectedAuthRoute role="ADMIN">
            <Outlet />
          </ProtectedAuthRoute>,
          children:[
            {
              path: '',
              element: <Admin/>
            },
            {
              path: 'list-faq',
              element: <ListFaq />
            }
          ]
        },
        {
          path: '/admin',
          element: <ProtectedAuthRoute role="ADMIN"><Admin/></ProtectedAuthRoute>
        },
        {
          path: '/lecturer',
          element: <ProtectedAuthRoute role="LECTURER"><Lecturer/></ProtectedAuthRoute>
        }
      ]
    },
    {
      path: '/login',
      element: <Login />
    },
    {
      path: '/403',
      element: <Page403 />
    }
  ])
  return (
    <RouterProvider router={router} />
  );

}

export default App;
