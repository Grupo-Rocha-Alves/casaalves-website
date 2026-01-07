import { useState, useCallback } from 'react';
import api from '../../service/api';
import toast from 'react-hot-toast';

interface DeleteUserResponse {
    success: boolean;
    message: string;
    data: {
        idUsuario: number;
        nome: string;
        login: string;
    };
}

export function useMutateDeleteUser() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Exclui um usuário do sistema
     * Requer nível de acesso 3 (administrador)
     * Ação irreversível
     */
    const deleteUser = useCallback(async (userId: number) => {
        setLoading(true);
        setError(null);

        try {
            const response = await api.delete<DeleteUserResponse>(
                `/auth/deleteUser/${userId}`
            );

            if (response.data.success) {
                toast.success(response.data.message || 'Usuário excluído com sucesso!');
                return response.data.data;
            }

            throw new Error('Falha ao excluir usuário');
        } catch (err: any) {
            const message = err.response?.data?.message || err.message || 'Erro ao excluir usuário';
            setError(message);
            toast.error(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        deleteUser,
        loading,
        error,
    };
}
