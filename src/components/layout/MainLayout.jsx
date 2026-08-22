import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';
import { useSocketEvents } from '../../hooks/useSocketEvents.js';

const MainLayout = () => {
  useSocketEvents();

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-siyoh-900">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
