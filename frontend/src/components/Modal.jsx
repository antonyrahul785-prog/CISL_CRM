import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-lg', position = 'center' }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const positionClasses = {
        center: 'items-center',
        top: 'items-start pt-10' // Added pt-10 to give some space from the top
    };

    return (
        <div className={`fixed inset-0 z-50 flex ${positionClasses[position] || 'items-center'} justify-center p-4 bg-black/80 backdrop-blur-md transition-all duration-300 font-inter`}>
            <div className={`bg-[var(--bg-card)] border border-[var(--border)] rounded-[2.5rem] shadow-2xl w-full ${maxWidth} transform transition-all scale-100 overflow-hidden flex flex-col max-h-[95vh]`}>
                {/* Header */}
                <div className="flex items-center justify-between px-8 py-6 border-b border-[var(--border)]">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
                        <h3 className="text-xl font-black text-[var(--text-main)] tracking-tight leading-none">{title}</h3>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-xl bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card)] transition-all border border-[var(--border)]">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-0 overflow-y-auto custom-scrollbar flex-grow">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
