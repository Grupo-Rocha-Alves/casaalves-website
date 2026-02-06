import { useState } from 'react';
import api from '../../service/api';
import toast from 'react-hot-toast';

interface CreateInvoiceData {
    data: string;
    valor?: number;
    dataVencimento: string;
    dataPagamento?: string;
    status?: string;
    formaPagamento?: string;
    nomeFornecedor: string;
    documentoFornecedor: string;
    descricao: string;
}

export function useMutateCreateInvoice() {
    const [loading, setLoading] = useState(false);

    const createInvoice = async (InvoiceData: CreateInvoiceData) => {
        setLoading(true);
        try {
            const response = await api.post<{
                success: boolean;
                message: string;
                data?: any;
            }>('/invoices/createInvoice', InvoiceData);

            if (response.data.success) {
                toast.success('Duplicata cadastrada com sucesso!');
                return response.data;
            }
        } catch (error: any) {
            const message = error.response?.data?.message || 'Erro ao cadastrar duplicata';
            toast.error(message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return {
        createInvoice,
        loading,
    };
}
