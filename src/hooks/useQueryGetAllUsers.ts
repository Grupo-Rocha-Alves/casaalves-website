import { useState, useCallback } from 'react';
import api from '../service/api';
import toast from 'react-hot-toast';

interface User {
    idUsuario: number;
    nome: string;
    login: string;
    nivelAcesso: number;
}

interface GetAllUsersParams {
    page?: number;
    limit?: number;
    nome?: string;
    nivelAcesso?: number;
}

interface GetAllUsersResponse {
    success: boolean;
    data: User[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export function useQueryGetAllUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Busca todos os usuários com filtros e paginação
     * Requer nível de acesso 3 (administrador)
     */
    const getAllUsers = useCallback(async (params?: GetAllUsersParams) => {
        setLoading(true);
        setError(null);

        try {
            const queryParams = new URLSearchParams();

            if (params?.page) queryParams.append('page', params.page.toString());
            if (params?.limit) queryParams.append('limit', params.limit.toString());
            if (params?.nome) queryParams.append('nome', params.nome);
            if (params?.nivelAcesso) queryParams.append('nivelAcesso', params.nivelAcesso.toString());

            const response = await api.get<GetAllUsersResponse>(
                `/auth/getAllUsers?${queryParams.toString()}`
            );

            if (response.data.success) {
                setUsers(response.data.data);
                setPagination(response.data.pagination);
                return response.data;
            }

            throw new Error('Falha ao buscar usuários');
        } catch (err: any) {
            const message = err.response?.data?.message || 'Erro ao buscar usuários';
            setError(message);
            toast.error(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Reseta o estado
     */
    const reset = useCallback(() => {
        setUsers([]);
        setPagination({
            page: 1,
            limit: 10,
            total: 0,
            totalPages: 0,
        });
        setError(null);
    }, []);

    return {
        users,
        pagination,
        loading,
        error,
        getAllUsers,
        reset,
    };
}
