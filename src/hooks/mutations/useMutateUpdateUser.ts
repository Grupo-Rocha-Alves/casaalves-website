import { useState, useCallback } from 'react';
import api from '../../service/api';
import toast from 'react-hot-toast';

interface User {
    idUsuario: number;
    nome: string;
    login: string;
    nivelAcesso: number;
}

interface UpdateUserData {
    nome?: string;
    login?: string;
    senha?: string;
    nivelAcesso?: number;
}

interface UpdateUserResponse {
    success: boolean;
    message: string;
    data: User;
}

export function useMutateUpdateUser() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Atualiza um usuário específico
     * Requer nível de acesso 3 (administrador)
     * Pelo menos um campo deve ser fornecido
     */
    const updateUser = useCallback(async (userId: number, data: UpdateUserData) => {
        setLoading(true);
        setError(null);

        try {
            // Validação: pelo menos um campo deve ser fornecido
            if (!data.nome && !data.login && !data.senha && !data.nivelAcesso) {
                throw new Error('Pelo menos um campo deve ser fornecido para atualização');
            }

            const response = await api.patch<UpdateUserResponse>(
                `/auth/updateUser/${userId}`,
                data
            );

            if (response.data.success) {
                toast.success(response.data.message || 'Usuário atualizado com sucesso!');
                return response.data.data;
            }

            throw new Error('Falha ao atualizar usuário');
        } catch (err: any) {
            const message = err.response?.data?.message || err.message || 'Erro ao atualizar usuário';
            setError(message);
            toast.error(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        updateUser,
        loading,
        error,
    };
}
