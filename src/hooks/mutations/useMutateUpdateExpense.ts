import { useState } from 'react';
import api from '../../service/api';
import toast from 'react-hot-toast';

interface UpdateExpenseData {
    data?: string;
    tipo?: string;
    categoria?: string;
    descricao?: string;
    valor?: string | number;
}

export function useMutateUpdateExpense() {
    const [loading, setLoading] = useState(false);

    const updateExpense = async (id: number, expenseData: UpdateExpenseData) => {
        setLoading(true);
        try {
            const response = await api.patch<{
                success: boolean;
                message: string;
                data?: any;
            }>(`/expenses/updateExpense/${id}`, expenseData);

            if (response.data.success) {
                toast.success('Despesa atualizada com sucesso!');
                return response.data;
            }
        } catch (error: any) {
            const message = error.response?.data?.message || 'Erro ao atualizar despesa';
            toast.error(message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return {
        updateExpense,
        loading,
    };
}
