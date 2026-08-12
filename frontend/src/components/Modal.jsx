import { X } from "lucide-react";
import "./Modal.css";
import { useEffect } from "react";

export default function Modal({ isOpen, onClose, title, children }) {
    
    // Fechar ao apertar ESC
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) {
            document.addEventListener("keydown", handleKeyDown);
        }
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            {/* Parar propagação do clique para não fechar quando clicar dentro do modal */}
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                
                <div className="modal-header">
                    <h2>{title}</h2>
                    <button className="modal-close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>
                
                <div className="modal-body">
                    {children}
                </div>

            </div>
        </div>
    );
}
