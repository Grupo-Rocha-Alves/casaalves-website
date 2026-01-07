import { useState, useCallback } from 'react';
import api from '../../service/api';
import toast from 'react-hot-toast';

interface CreateUserData {
    nome: string;
    login: string;
    senha: string;
    nivelAcesso: number;
}

interface CreateUserResponse {
    success: boolean;
    message: string;
    data: {
        idUsuario: number;
        nome: string;
        login: string;
        nivelAcesso: number;
    };
}

export function useMutateCreateUser() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Cria um novo usuário no sistema
     * Requer nível de acesso 3 (administrador)
     */
    const createUser = useCallback(async (data: CreateUserData) => {
        setLoading(true);
        setError(null);

        try {
            const response = await api.post<CreateUserResponse>('/auth/register', {
                nome: data.nome,
                login: data.login,
                senha: data.senha,
                nivelAcesso: data.nivelAcesso,
            });

            if (response.data.success) {
                toast.success(response.data.message || 'Usuário criado com sucesso!');
                return response.data.data;
            }

            throw new Error('Falha ao criar usuário');
        } catch (err: any) {
            const message = err.response?.data?.message || err.message || 'Erro ao criar usuário';
            setError(message);
            toast.error(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        createUser,
        loading,
        error,
    };
}
