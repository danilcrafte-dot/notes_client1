// Універсальна кнопка: варіанти primary / secondary / ghost / danger / ghost-danger, стан завантаження.
import '../styles/components/Button.scss';

export default function Button({
  variant = 'primary', size = 'md', type = 'button', loading = false, disabled = false,
  className = '', children, ...rest
}) {
  return (
    <button
      type={type}
      className={`btn btn--${variant} btn--${size} ${className}`.trim()}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading && <span className="btn__spinner" aria-hidden="true" />}
      {children}
    </button>
  );
}
