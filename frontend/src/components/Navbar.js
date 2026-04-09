import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_LINKS = [
  { to: '/dishes', label: '🍽️ Dishes' },
  { to: '/dish-types', label: '🗂️ Types' },
  { to: '/ingredients', label: '🥕 Ingredients' },
  { to: '/cooks', label: '👨‍🍳 Team' },
];

export default function Navbar() {
  const { cook, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="navbar-logo">🍽️</span>
        <span className="navbar-title">Kitchen Service</span>
      </div>
      <ul className="navbar-links">
        {NAV_LINKS.map((l) => (
          <li key={l.to}>
            <NavLink to={l.to} className={({ isActive }) => isActive ? 'nav-link nav-link--active' : 'nav-link'}>
              {l.label}
            </NavLink>
          </li>
        ))}
      </ul>
      <div className="navbar-user">
        <span className="navbar-avatar">{cook?.first_name?.[0]}{cook?.last_name?.[0]}</span>
        <span className="navbar-name">{cook?.first_name}</span>
        <button className="btn btn-sm btn-ghost" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}
