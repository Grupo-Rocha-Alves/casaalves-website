import { useState } from 'react';
import api from '../../service/api';
import toast from 'react-hot-toast';

export function useMutateDeleteExpense() {
    const [loading, setLoading] = useState(false);

    const deleteExpense = async (id: number) => {
        setLoading(true);
        try {
            const response = await api.delete<{
                success: boolean;
                message: string;
            }>(`/expenses/deleteExpense/${id}`);

            if (response.data.success) {
                toast.success('Despesa excluída com sucesso!');
                return response.data;
            }
        } catch (error: any) {
            const message = error.response?.data?.message || 'Erro ao excluir despesa';
            toast.error(message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return {
        deleteExpense,
        loading,
    };
}
