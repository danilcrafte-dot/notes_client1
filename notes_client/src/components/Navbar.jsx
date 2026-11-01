// Верхня панель навігації.
import { NavLink } from 'react-router-dom';
import ThemeToggle from './ThemeToggle.jsx';
import '../styles/components/Navbar.scss';

const LINKS = [
  { to: '/', label: 'Нотатки', end: true },
  { to: '/categories', label: 'Категорії' },
  { to: '/tags', label: 'Теги' },
];

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar__inner container">
        <span className="navbar__brand">📝 Нотатки</span>
        <nav className="navbar__links" aria-label="Головна навігація">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) => `navbar__link ${isActive ? 'navbar__link--active' : ''}`.trim()}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
