import React from 'react';
import Modal from './Modal';

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message }) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <div style={{ marginBottom: '20px', fontSize: '1rem', color: 'var(--text-color)' }}>
                {message}
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn" onClick={onClose}>
                    Cancelar
                </button>
                <button type="button" className="btn btn-danger" onClick={() => {
                    onConfirm();
                    onClose();
                }}>
                    Confirmar
                </button>
            </div>
        </Modal>
    );
}
