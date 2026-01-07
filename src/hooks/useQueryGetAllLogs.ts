import { useState, useCallback } from 'react';
import api from '../service/api';
import toast from 'react-hot-toast';

interface Log {
    idLog: number;
    idUsuario: number;
    nomeUsuario: string;
    acao: string;
    dataHora: string;
}

interface GetAllLogsParams {
    page?: number;
    limit?: number;
    idUsuario?: number;
    acao?: string;
    dataInicio?: string;
    dataFim?: string;
}

interface GetAllLogsResponse {
    success: boolean;
    data: Log[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export function useQueryGetAllLogs() {
    const [logs, setLogs] = useState<Log[]>([]);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Busca todos os logs com filtros e paginação
     * Requer nível de acesso 3 (administrador)
     */
    const getAllLogs = useCallback(async (params?: GetAllLogsParams) => {
        setLoading(true);
        setError(null);

        try {
            const queryParams = new URLSearchParams();

            if (params?.page) queryParams.append('page', params.page.toString());
            if (params?.limit) queryParams.append('limit', params.limit.toString());
            if (params?.idUsuario) queryParams.append('idUsuario', params.idUsuario.toString());
            if (params?.acao) queryParams.append('acao', params.acao);
            if (params?.dataInicio) queryParams.append('dataInicio', params.dataInicio);
            if (params?.dataFim) queryParams.append('dataFim', params.dataFim);

            const response = await api.get<GetAllLogsResponse>(
                `/logs/getAllLogs?${queryParams.toString()}`
            );

            if (response.data.success) {
                setLogs(response.data.data);
                setPagination(response.data.pagination);
                return response.data;
            }

            throw new Error('Falha ao buscar logs');
        } catch (err: any) {
            const message = err.response?.data?.message || 'Erro ao buscar logs';
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
        setLogs([]);
        setPagination({
            page: 1,
            limit: 10,
            total: 0,
            totalPages: 0,
        });
        setError(null);
    }, []);

    return {
        logs,
        pagination,
        loading,
        error,
        getAllLogs,
        reset,
    };
}
