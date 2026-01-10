import { useState } from 'react';
import api from '../../service/api';
import toast from 'react-hot-toast';

interface CreateExpenseData {
    data: string;
    tipo: string;
    categoria: string;
    descricao: string;
    valor: string | number;
}

export function useMutateCreateExpense() {
    const [loading, setLoading] = useState(false);

    const createExpense = async (expenseData: CreateExpenseData) => {
        setLoading(true);
        try {
            const response = await api.post<{
                success: boolean;
                message: string;
                data?: any;
            }>('/expenses/createExpense', expenseData);

            if (response.data.success) {
                toast.success('Despesa cadastrada com sucesso!');
                return response.data;
            }
        } catch (error: any) {
            const message = error.response?.data?.message || 'Erro ao cadastrar despesa';
            toast.error(message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return {
        createExpense,
        loading,
    };
}
