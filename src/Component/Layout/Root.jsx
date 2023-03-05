import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Header from "./Header";
import MainSidebar from "./MainSidebar";
import "react-toastify/dist/ReactToastify.css";
export default function Root() {
  return (
    <div className="flex h-screen w-full flex-col overflow-hidden">
      <Header />
      <div className="flex h-full w-full overflow-auto">
        <MainSidebar />
        <main className="flex-1 overflow-auto p-1">
          <Outlet />
        </main>
      </div>
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
        theme="light"
      />
    </div>
  );
}
