import { AlertTriangle, X } from 'lucide-react';
import { Button } from './Button';

interface DeleteConfirmModalProps {
    isOpen: boolean;
    userName?: string;
    title?: string;
    message?: string;
    buttonText?: string;
    loading: boolean;
    onConfirm: () => void;
    onCancel?: () => void;
    onClose?: () => void;
}

export function DeleteConfirmModal({
    isOpen,
    userName,
    title = 'Confirmar Exclusão',
    message,
    buttonText = 'Excluir',
    loading,
    onConfirm,
    onCancel,
    onClose,
}: DeleteConfirmModalProps) {
    if (!isOpen) return null;

    const handleClose = onClose || onCancel;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                            <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full">
                                <AlertTriangle className="w-6 h-6 text-red-600" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                        </div>
                        {handleClose && (
                            <button
                                onClick={handleClose}
                                disabled={loading}
                                className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        )}
                    </div>

                    <div className="mb-6">
                        {message ? (
                            <p className="text-gray-600">{message}</p>
                        ) : userName ? (
                            <>
                                <p className="text-gray-700 mb-2">
                                    Tem certeza que deseja excluir o usuário <span className="font-semibold">{userName}</span>?
                                </p>
                            </>
                        ) : (
                            <p className="text-gray-600">
                                Tem certeza que deseja confirmar esta ação? Esta ação não pode ser desfeita.
                            </p>
                        )}
                    </div>

                    <div className="flex space-x-3">
                        {handleClose && (
                            <Button
                                variant="secondary"
                                onClick={handleClose}
                                disabled={loading}
                                className="flex-1"
                            >
                                Cancelar
                            </Button>
                        )}
                        <Button
                            onClick={onConfirm}
                            isLoading={loading}
                            className="flex-1 bg-red-600 hover:bg-red-700 focus:ring-red-500"
                        >
                            {buttonText}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
