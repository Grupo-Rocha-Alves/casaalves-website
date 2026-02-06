import { useState } from 'react';
import api from '../service/api';
import toast from 'react-hot-toast';

interface DashboardVendas {
    totalCartao: string;
    totalPix: string;
    totalEspecie: string;
    totalOutro: string;
    totalGeral: string;
}

interface DashboardDespesas {
    mercadorias: string;
    servicos: string;
    impostos: string;
    diversos: string;
    proventos: string;
    totalGeral: string;
}

interface DashboardDuplicatas {
    pendente: string;
    pago: string;
    totalGeral: string;
}

interface VendasPorDiaSemana {
    diaSemana: string;
    total: string;
}

interface DadosDiarios {
    data: string; // Formato: "YYYY-MM-DD"
    diaSemana: string;
    totalVendas: string;
    totalDespesas: string;
    totalDuplicatas: string;
    faturamentoLiquido: string;
}

interface DashboardData {
    mes: number;
    ano: number;
    totalVendas: string;
    totalDespesas: string;
    totalDuplicatas: string;
    despesasOperacionais: string;
    despesasAdministrativas: string;
    despesasPessoais: string;
    faturamentoLiquido: string;
    margemLucro: string;
    mediaDiariaVendas: string;
    mediaDiariaDespesas: string;
    vendas: DashboardVendas;
    despesas: DashboardDespesas;
    duplicatas: DashboardDuplicatas;
    vendasPorDiaSemana: VendasPorDiaSemana[];
    numeroDiasMes: number;
    dadosDiarios: DadosDiarios[];
}

interface GetDashboardParams {
    mes?: number;
    ano?: number;
    order?: 'asc' | 'desc';
}

export function useQueryGetDashboard() {
    const [dashboard, setDashboard] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(false);

    const getDashboard = async (params: GetDashboardParams = {}) => {
        setLoading(true);
        try {
            const response = await api.get<DashboardData>('/dashboard/getDashboard', { params });

            setDashboard(response.data);
        } catch (error: any) {
            const message = error.response?.data?.error || 'Erro ao buscar dados do dashboard';
            toast.error(message);
            setDashboard(null);
        } finally {
            setLoading(false);
        }
    };

    return {
        dashboard,
        loading,
        getDashboard,
    };
}
