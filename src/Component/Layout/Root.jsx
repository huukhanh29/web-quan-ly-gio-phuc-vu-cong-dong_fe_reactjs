
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Header from "./Header";
import MainSidebar from "./MainSidebar";
import 'react-toastify/dist/ReactToastify.css';
import { useStore } from "react-redux";
import axios from "axios";
import Footers from "./Footer";

export default function Root() {
  const {token} = useStore().getState().auth;
  axios.defaults.headers.common['Authorization'] = `Bearer ${token ?? ''}`;
  return (
    <div className="flex w-full flex-col overflow-hidden">
      <Header />
      <div className="flex h-full w-full min-w-max overflow-auto">
        <MainSidebar />
        <main className="flex-1 overflow-auto p-1">
          <Outlet />
          
        </main>
      </div>
      <Footers/>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        theme='light'
      />
    </div>
  );
}