import { useState } from 'react';
import api from '../../service/api';
import toast from 'react-hot-toast';

interface UpdateInvoiceData {
    data?: string;
    valor?: number;
    dataVencimento?: string;
    dataPagamento?: string;
    status?: string;
    formaPagamento?: string;
    nomeFornecedor?: string;
    documentoFornecedor?: string;
    descricao?: string;
}

export function useMutateUpdateInvoice() {
    const [loading, setLoading] = useState(false);

    const updateInvoice = async (id: number, InvoiceData: UpdateInvoiceData) => {
        setLoading(true);
        try {
            const response = await api.patch<{
                success: boolean;
                message: string;
                data?: any;
            }>(`/invoices/updateInvoice/${id}`, InvoiceData);

            if (response.data.success) {
                toast.success('Duplicata atualizada com sucesso!');
                return response.data;
            }
        } catch (error: any) {
            const message = error.response?.data?.message || 'Erro ao atualizar duplicata';
            toast.error(message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return {
        updateInvoice,
        loading,
    };
}
