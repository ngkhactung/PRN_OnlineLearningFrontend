import { Outlet } from "react-router-dom";
import Header from "../common/Header";
import Footer from "../common/Footer";
function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-4 mt-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;
