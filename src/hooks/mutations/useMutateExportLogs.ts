import { useState } from 'react';
import api from '../../service/api';
import toast from 'react-hot-toast';

interface ExportLogsParams {
    idUsuario?: number;
    acao?: string;
    dataInicio?: string;
    dataFim?: string;
}

export function useMutateExportLogs() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Exporta logs em formato CSV com filtros aplicados
     * Requer nível de acesso 3 (administrador)
     */
    const exportLogs = async (params?: ExportLogsParams) => {
        setLoading(true);
        setError(null);

        try {
            const queryParams = new URLSearchParams();

            if (params?.idUsuario) queryParams.append('idUsuario', params.idUsuario.toString());
            if (params?.acao) queryParams.append('acao', params.acao);
            if (params?.dataInicio) queryParams.append('dataInicio', params.dataInicio);
            if (params?.dataFim) queryParams.append('dataFim', params.dataFim);

            const response = await api.get(
                `/logs/exportLogs?${queryParams.toString()}`,
                {
                    responseType: 'blob',
                }
            );

            // Criar blob e fazer download
            const blob = new Blob([response.data as BlobPart], { type: 'text/csv;charset=utf-8;' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            
            // Nome do arquivo com data atual
            const fileName = `logs_${new Date().toISOString().split('T')[0]}.csv`;
            link.setAttribute('download', fileName);
            
            // Trigger download
            document.body.appendChild(link);
            link.click();
            
            // Cleanup
            link.remove();
            window.URL.revokeObjectURL(url);

            toast.success('Logs exportados com sucesso!');
            return response.data;
        } catch (err: any) {
            const message = err.response?.data?.message || 'Erro ao exportar logs';
            setError(message);
            toast.error(message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        exportLogs,
        loading,
        error,
    };
}
