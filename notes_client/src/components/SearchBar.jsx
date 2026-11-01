// Рядок пошуку.
import '../styles/components/SearchBar.scss';

export default function SearchBar({ value, onChange, placeholder = 'Пошук за назвою, текстом або тегом…' }) {
  return (
    <div className="search-bar">
      <input
        type="search"
        className="search-bar__input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Пошук нотаток"
      />
    </div>
  );
}
