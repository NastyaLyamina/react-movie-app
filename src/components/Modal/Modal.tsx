import './Modal.scss';

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
  variant?: 'default' | 'video';
}

const Modal = ({ onClose, children, variant = 'default' }: ModalProps) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className={`modal-wrapper ${variant === 'video' ? 'modal-video-variant' : ''}`} 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content">
          {children}
        </div>
        <button className="modal-close" onClick={onClose}>
          <img className="close-icon" src="/close-icon.svg" alt="Иконка" />
        </button>
      </div>
    </div>
  );
};

export default Modal;