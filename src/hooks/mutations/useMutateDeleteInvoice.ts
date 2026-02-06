import { useState } from 'react';
import api from '../../service/api';
import toast from 'react-hot-toast';

export function useMutateDeleteInvoice() {
    const [loading, setLoading] = useState(false);

    const deleteInvoice = async (id: number) => {
        setLoading(true);
        try {
            const response = await api.delete<{
                success: boolean;
                message: string;
            }>(`/invoices/deleteInvoice/${id}`);

            if (response.data.success) {
                toast.success('Duplicata excluída com sucesso!');
                return response.data;
            }
        } catch (error: any) {
            const message = error.response?.data?.message || 'Erro ao excluir duplicata';
            toast.error(message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return {
        deleteInvoice,
        loading,
    };
}
