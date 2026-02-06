import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { BarChart3 } from 'lucide-react';
import { useQueryGetDashboard } from '../hooks/useQueryGetDashboard';
import { DashboardFilters } from '../components/DashboardFilters';
import { DashboardSummaryCards } from '../components/DashboardSummaryCards';
import { DashboardCharts } from '../components/DashboardCharts';
import { DashboardDailyTable } from '../components/DashboardDailyTable';

export default function Home() {
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    const router = useRouter();
    
    // State for filters
    const [month, setMonth] = useState(new Date().getMonth());
    const [year, setYear] = useState(new Date().getFullYear());

    const { dashboard, loading: dashboardLoading, getDashboard } = useQueryGetDashboard();

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, authLoading, router]);

    // Fetch dashboard data when filters change
    useEffect(() => {
        if (isAuthenticated) {
            getDashboard({ mes: month, ano: year });
        }
    }, [month, year, isAuthenticated]);

    if (authLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Carregando...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <>
            <Head>
                <title>Dashboard - Casa Alves</title>
            </Head>

            <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="flex items-center space-x-3">
                                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full">
                                    <BarChart3 className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Visão geral e estatísticas do sistema
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <DashboardFilters 
                        month={month} 
                        year={year} 
                        onMonthChange={setMonth} 
                        onYearChange={setYear}
                        loading={dashboardLoading}
                    />

                    {dashboardLoading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                        </div>
                    ) : dashboard ? (
                        <div className="animate-in fade-in duration-500">
                            <DashboardSummaryCards data={dashboard} />
                            
                            <DashboardCharts 
                                dadosDiarios={dashboard.dadosDiarios}
                                vendasPorDiaSemana={dashboard.vendasPorDiaSemana}
                                vendas={dashboard.vendas}
                                despesas={dashboard.despesas}
                                duplicatas={dashboard.duplicatas}
                            />

                            <DashboardDailyTable data={dashboard.dadosDiarios} />
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-lg shadow-sm border border-gray-100">
                            <p className="text-gray-500">
                                Não foi possível carregar os dados do dashboard.
                            </p>
                            <button 
                                onClick={() => getDashboard({ mes: month, ano: year })}
                                className="mt-4 text-green-600 hover:text-green-700 font-medium"
                            >
                                Tentar novamente
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}