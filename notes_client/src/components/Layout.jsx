// Каркас сторінок: тема, навігація, область вмісту (Outlet) і підвал.
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import '../styles/components/Layout.scss';

export default function Layout() {
  const { theme } = useTheme();
  return (
    <div className={`app theme-${theme}`}>
      <Navbar />
      <main className="app__main container">
        <Outlet />
      </main>
      <footer className="app__footer container">Менеджер нотаток · навчальна практика з програмування</footer>
    </div>
  );
}
