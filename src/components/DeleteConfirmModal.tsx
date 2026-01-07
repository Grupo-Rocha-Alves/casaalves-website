import { AlertTriangle, X } from 'lucide-react';
import { Button } from './Button';

interface DeleteConfirmModalProps {
    isOpen: boolean;
    userName: string;
    loading: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export function DeleteConfirmModal({
    isOpen,
    userName,
    loading,
    onConfirm,
    onCancel,
}: DeleteConfirmModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                            <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full">
                                <AlertTriangle className="w-6 h-6 text-red-600" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">Confirmar Exclusão</h2>
                        </div>
                        <button
                            onClick={onCancel}
                            disabled={loading}
                            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="mb-6">
                        <p className="text-gray-700 mb-2">
                            Tem certeza que deseja excluir o usuário <span className="font-semibold">{userName}</span>?
                        </p>
                        <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                            ⚠️ Esta ação é irreversível e todos os dados do usuário serão permanentemente removidos.
                        </p>
                    </div>

                    <div className="flex space-x-3">
                        <Button
                            variant="secondary"
                            onClick={onCancel}
                            disabled={loading}
                            className="flex-1"
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={onConfirm}
                            isLoading={loading}
                            className="flex-1 bg-red-600 hover:bg-red-700 focus:ring-red-500"
                        >
                            Excluir Usuário
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
