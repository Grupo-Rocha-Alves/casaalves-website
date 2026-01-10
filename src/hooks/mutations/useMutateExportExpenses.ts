import { useState } from 'react';
import api from '../../service/api';
import toast from 'react-hot-toast';

interface ExportExpensesParams {
    mes?: number;
    ano?: number;
    tipo?: string;
    categoria?: string;
    dataInicio?: string;
    dataFim?: string;
}

export function useMutateExportExpenses() {
    const [loading, setLoading] = useState(false);

    const exportExpenses = async (params: ExportExpensesParams = {}) => {
        setLoading(true);
        try {
            const response = await api.get<Blob>('/expenses/exportExpenses', {
                params,
                responseType: 'blob',
            });

            // Criar URL para o blob
            const url = window.URL.createObjectURL(new Blob([response.data as BlobPart]));
            const link = document.createElement('a');
            link.href = url;
            
            // Nome do arquivo com data atual
            const dataAtual = new Date().toISOString().split('T')[0];
            link.setAttribute('download', `despesas_${dataAtual}.csv`);
            
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            toast.success('Despesas exportadas com sucesso!');
        } catch (error: any) {
            const message = error.response?.data?.message || 'Erro ao exportar despesas';
            toast.error(message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return {
        exportExpenses,
        loading,
    };
}
