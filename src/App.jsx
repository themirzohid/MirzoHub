import { Routes, Route } from 'react-router-dom';

import MainLayout from './components/layout/MainLayout.jsx';
import ProtectedRoute from './components/layout/ProtectedRoute.jsx';

import HomePage from './pages/HomePage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import StartupDetailPage from './pages/StartupDetailPage.jsx';
import CreateStartupPage from './pages/CreateStartupPage.jsx';
import EditStartupPage from './pages/EditStartupPage.jsx';
import DevelopersPage from './pages/DevelopersPage.jsx';
import DeveloperProfilePage from './pages/DeveloperProfilePage.jsx';
import MyProfilePage from './pages/MyProfilePage.jsx';
import RequestsPage from './pages/RequestsPage.jsx';
import MessagesPage from './pages/MessagesPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Ochiq sahifalar */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/startups/:id" element={<StartupDetailPage />} />
        <Route path="/developers" element={<DevelopersPage />} />
        <Route path="/developers/:id" element={<DeveloperProfilePage />} />

        {/* Faqat login qilingan foydalanuvchilar uchun */}
        <Route
          path="/startups/new"
          element={
            <ProtectedRoute>
              <CreateStartupPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/startups/:id/edit"
          element={
            <ProtectedRoute>
              <EditStartupPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/me"
          element={
            <ProtectedRoute>
              <MyProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/requests"
          element={
            <ProtectedRoute>
              <RequestsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/messages"
          element={
            <ProtectedRoute>
              <MessagesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/messages/:userId"
          element={
            <ProtectedRoute>
              <MessagesPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
