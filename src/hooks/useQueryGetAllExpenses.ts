import { useState } from 'react';
import api from '../service/api';
import toast from 'react-hot-toast';

interface Expense {
    idDespesa: number;
    data: string;
    mes: number;
    ano: number;
    diaSemana: string;
    tipo: string;
    categoria: string;
    descricao: string;
    valor: string;
}

interface GetAllExpensesParams {
    mes?: number;
    ano?: number;
    tipo?: string;
    categoria?: string;
    dataInicio?: string;
    dataFim?: string;
    page?: number;
    limit?: number;
}

interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export function useQueryGetAllExpenses() {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState<Pagination>({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
    });

    const getAllExpenses = async (params: GetAllExpensesParams = {}) => {
        setLoading(true);
        try {
            const response = await api.get<{
                success: boolean;
                data: Expense[];
                pagination: Pagination;
            }>('/expenses/getAllExpenses', { params });

            if (response.data.success) {
                setExpenses(response.data.data);
                setPagination(response.data.pagination);
            }
        } catch (error: any) {
            const message = error.response?.data?.message || 'Erro ao buscar despesas';
            toast.error(message);
            setExpenses([]);
            setPagination({
                page: 1,
                limit: 10,
                total: 0,
                totalPages: 0,
            });
        } finally {
            setLoading(false);
        }
    };

    return {
        expenses,
        loading,
        pagination,
        getAllExpenses,
    };
}
