// Перемикач світлої/темної теми.
import { useTheme } from '../context/ThemeContext.jsx';
import '../styles/components/ThemeToggle.scss';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const next = theme === 'light' ? 'темну' : 'світлу';
  return (
    <button type="button" className="theme-toggle" onClick={toggleTheme} aria-label={`Перемкнути на ${next} тему`} title={`Перемкнути на ${next} тему`}>
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
}
