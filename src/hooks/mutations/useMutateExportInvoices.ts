import { useState } from 'react';
import api from '../../service/api';
import toast from 'react-hot-toast';

interface ExportInvoicesParams {
    mes?: number;
    ano?: number;
    status?: string;
    nomeFornecedor?: string;
    documentoFornecedor?: string;
    formaPagamento?: string;
    dataInicio?: string;
    dataFim?: string;
    dataVencimentoInicio?: string;
    dataVencimentoFim?: string;
    dataPagamentoInicio?: string;
    dataPagamentoFim?: string;
}

export function useMutateExportInvoices() {
    const [loading, setLoading] = useState(false);

    const exportInvoices = async (params: ExportInvoicesParams = {}) => {
        setLoading(true);
        try {
            const response = await api.get<Blob>('/invoices/exportInvoices', {
                params,
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data as BlobPart]));
            const link = document.createElement('a');
            link.href = url;
            
            const dataAtual = new Date().toISOString().split('T')[0];
            link.setAttribute('download', `duplicatas_${dataAtual}.csv`);
            
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            toast.success('Duplicatas exportadas com sucesso!');
        } catch (error: any) {
            const message = error.response?.data?.message || 'Erro ao exportar duplicatas';
            toast.error(message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return {
        exportInvoices,
        loading,
    };
}
