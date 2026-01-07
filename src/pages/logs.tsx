import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import { Button } from '../components/Button';
import { Card, CardContent } from '../components/Card';
import Head from 'next/head';
import { useQueryGetAllLogs } from '../hooks/useQueryGetAllLogs';
import { useQueryGetAllUsers } from '../hooks/useQueryGetAllUsers';
import { useMutateExportLogs } from '../hooks/mutations/useMutateExportLogs';
import { LogsFilters } from '../components/LogsFilters';
import { LogsTable } from '../components/LogsTable';
import { Pagination } from '../components/Pagination';
import { ScrollText, Download } from 'lucide-react';

export default function Logs() {
    const { user, isAuthenticated, loading, isAdmin } = useAuth();
    const router = useRouter();
    const { logs, pagination, loading: loadingLogs, getAllLogs } = useQueryGetAllLogs();
    const { users, loading: loadingUsers, getAllUsers } = useQueryGetAllUsers();
    const { exportLogs, loading: loadingExport } = useMutateExportLogs();

    // Estados de filtros
    const [searchAcao, setSearchAcao] = useState('');
    const [filterIdUsuario, setFilterIdUsuario] = useState('');
    const [dateStart, setDateStart] = useState('');
    const [dateEnd, setDateEnd] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push('/login');
        } else if (!loading && !isAdmin) {
            router.push('/home');
        }
    }, [isAuthenticated, loading, isAdmin, router]);

    useEffect(() => {
        if (isAuthenticated && isAdmin) {
            loadLogs();
            // Buscar usuários para o filtro (sem paginação)
            getAllUsers({ limit: 100 });
        }
    }, [isAuthenticated, isAdmin, currentPage]);

    const loadLogs = async () => {
        try {
            await getAllLogs({
                page: currentPage,
                limit: 50,
                acao: searchAcao || undefined,
                idUsuario: filterIdUsuario ? Number(filterIdUsuario) : undefined,
                dataInicio: dateStart || undefined,
                dataFim: dateEnd || undefined,
            });
        } catch (error) {
            // Erro já tratado no hook
        }
    };

    const handleSearch = () => {
        setCurrentPage(1);
        loadLogs();
    };

    const handleClearFilters = () => {
        setSearchAcao('');
        setFilterIdUsuario('');
        setDateStart('');
        setDateEnd('');
        setCurrentPage(1);
        setTimeout(() => {
            getAllLogs({ page: 1, limit: 50 });
        }, 100);
    };

    const handleExport = async () => {
        try {
            await exportLogs({
                acao: searchAcao || undefined,
                idUsuario: filterIdUsuario ? Number(filterIdUsuario) : undefined,
                dataInicio: dateStart || undefined,
                dataFim: dateEnd || undefined,
            });
        } catch (error) {
            // Erro já tratado no hook
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Carregando...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated || !isAdmin) {
        return null;
    }

    return (
        <>
            <Head>
                <title>Logs do Sistema - Casa Alves</title>
            </Head>

            <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-6 sm:mb-8">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex items-center space-x-3">
                                <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex-shrink-0">
                                    <ScrollText className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                                </div>
                                <div className="min-w-0">
                                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Logs do Sistema</h1>
                                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                                        Visualize o histórico de ações dos usuários
                                    </p>
                                </div>
                            </div>
                            <Button 
                                onClick={handleExport} 
                                variant="secondary"
                                disabled={loadingExport}
                                className="w-full sm:w-auto"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                {loadingExport ? 'Exportando...' : 'Exportar'}
                            </Button>
                        </div>
                    </div>

                    {/* Estatísticas */}
                    {pagination.total > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <Card>
                                <CardContent className="py-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-500">Total de Logs</p>
                                            <p className="text-2xl font-bold text-gray-900">{pagination.total}</p>
                                        </div>
                                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                            <ScrollText className="w-6 h-6 text-blue-600" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="py-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-500">Página Atual</p>
                                            <p className="text-2xl font-bold text-gray-900">{currentPage} / {pagination.totalPages}</p>
                                        </div>
                                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                            <span className="text-xl">📄</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="py-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-500">Logs na Página</p>
                                            <p className="text-2xl font-bold text-gray-900">{logs.length}</p>
                                        </div>
                                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                                            <span className="text-xl">📊</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Filtros */}
                    <Card className="mb-6">
                        <CardContent className="py-4">
                            <LogsFilters
                                searchAcao={searchAcao}
                                filterIdUsuario={filterIdUsuario}
                                dateStart={dateStart}
                                dateEnd={dateEnd}
                                users={users}
                                loadingUsers={loadingUsers}
                                onSearchChange={setSearchAcao}
                                onUserFilterChange={setFilterIdUsuario}
                                onDateStartChange={setDateStart}
                                onDateEndChange={setDateEnd}
                                onSearch={handleSearch}
                                onClearFilters={handleClearFilters}
                            />
                        </CardContent>
                    </Card>

                    {/* Tabela de Logs */}
                    <Card>
                        <CardContent className="p-0">
                            <LogsTable
                                logs={logs}
                                loading={loadingLogs}
                            />
                            <Pagination
                                currentPage={currentPage}
                                totalPages={pagination.totalPages}
                                totalItems={pagination.total}
                                itemsPerPage={pagination.limit}
                                onPageChange={setCurrentPage}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
