import { FormEvent } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';
import { getAccessLevelLabel, ACCESS_LEVELS } from '../utils/accessLevel';

interface UserFormData {
    nome: string;
    login: string;
    senha: string;
    nivelAcesso: number;
}

interface UserModalProps {
    isOpen: boolean;
    mode: 'create' | 'edit';
    formData: UserFormData;
    errors: Partial<UserFormData>;
    loading: boolean;
    onClose: () => void;
    onSubmit: (e: FormEvent) => void;
    onFormChange: (data: Partial<UserFormData>) => void;
}

export function UserModal({
    isOpen,
    mode,
    formData,
    errors,
    loading,
    onClose,
    onSubmit,
    onFormChange,
}: UserModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">
                        {mode === 'create' ? 'Criar Novo Usuário' : 'Editar Usuário'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={onSubmit} className="p-6 space-y-4">
                    <Input
                        label="Nome"
                        type="text"
                        value={formData.nome}
                        onChange={(e) => onFormChange({ nome: e.target.value })}
                        error={errors.nome}
                        placeholder="Nome completo"
                    />

                    <Input
                        label="Login"
                        type="text"
                        value={formData.login}
                        onChange={(e) => onFormChange({ login: e.target.value })}
                        error={errors.login}
                        placeholder="Login de acesso"
                    />

                    <Input
                        label={mode === 'create' ? 'Senha' : 'Nova Senha (opcional)'}
                        type="password"
                        value={formData.senha}
                        onChange={(e) => onFormChange({ senha: e.target.value })}
                        error={errors.senha}
                        placeholder={mode === 'create' ? 'Senha do usuário' : 'Deixe vazio para não alterar'}
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Nível de Acesso
                        </label>
                        <select
                            value={formData.nivelAcesso}
                            onChange={(e) => onFormChange({ nivelAcesso: Number(e.target.value) })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                            <option value={ACCESS_LEVELS.USER}>{getAccessLevelLabel(ACCESS_LEVELS.USER)}</option>
                            <option value={ACCESS_LEVELS.MANAGER}>{getAccessLevelLabel(ACCESS_LEVELS.MANAGER)}</option>
                            <option value={ACCESS_LEVELS.ADMIN}>{getAccessLevelLabel(ACCESS_LEVELS.ADMIN)}</option>
                        </select>
                    </div>

                    <div className="flex space-x-3 pt-4">
                        <Button
                            type="submit"
                            isLoading={loading}
                            className="flex-1"
                        >
                            {mode === 'create' ? 'Criar Usuário' : 'Salvar Alterações'}
                        </Button>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancelar
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
