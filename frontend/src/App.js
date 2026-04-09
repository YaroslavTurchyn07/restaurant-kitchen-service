import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DishesPage from './pages/DishesPage';
import DishTypesPage from './pages/DishTypesPage';
import CooksPage from './pages/CooksPage';
import IngredientsPage from './pages/IngredientsPage';

function PrivateRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { token } = useAuth();
  return token ? <Navigate to="/dishes" replace /> : children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
          <Route
            path="/*"
            element={
              <PrivateRoute>
                <Navbar />
                <main className="main-content">
                  <Routes>
                    <Route path="/" element={<Navigate to="/dishes" replace />} />
                    <Route path="/dishes" element={<DishesPage />} />
                    <Route path="/dish-types" element={<DishTypesPage />} />
                    <Route path="/cooks" element={<CooksPage />} />
                    <Route path="/ingredients" element={<IngredientsPage />} />
                  </Routes>
                </main>
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
