import '../styles/CenterModal.css';

export function CenterModal({ open, title, onClose, children }) {
  if (!open) return null;

  return (
    <div className="center-modal__overlay" onClick={onClose}>
      <div className="center-modal__window" onClick={(e) => e.stopPropagation()}>
        {title && <h2 className="center-modal__title">{title}</h2>}
        <div className="center-modal__content">{children}</div>
      </div>
    </div>
  );
}