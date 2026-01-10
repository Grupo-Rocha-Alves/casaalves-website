import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import { Button } from '../components/Button';
import { Card, CardContent } from '../components/Card';
import Head from 'next/head';
import { useQueryGetAllSales } from '../hooks/useQueryGetAllSales';
import { useMutateCreateSale } from '../hooks/mutations/useMutateCreateSale';
import { useMutateUpdateSale } from '../hooks/mutations/useMutateUpdateSale';
import { useMutateDeleteSale } from '../hooks/mutations/useMutateDeleteSale';
import { useMutateExportSales } from '../hooks/mutations/useMutateExportSales';
import { SalesFilters } from '../components/SalesFilters';
import { SalesTable } from '../components/SalesTable';
import { SaleModal, SaleFormData } from '../components/SaleModal';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import { Pagination } from '../components/Pagination';
import { ShoppingCart, Download, Plus, File, BarChart3 } from 'lucide-react';

interface Sale {
    idVenda: number;
    data: string;
    mes: number;
    ano: number;
    diaSemana: string;
    totalCartao: string;
    totalPix: string;
    totalEspecie: string;
    totalOutro: string;
    totalDia: string;
}

export default function Vendas() {
    const { user, isAuthenticated, loading: authLoading, isAdmin, isManager } = useAuth();
    const router = useRouter();
    const { sales, pagination, loading: loadingSales, getAllSales } = useQueryGetAllSales();
    const { createSale, loading: loadingCreate } = useMutateCreateSale();
    const { updateSale, loading: loadingUpdate } = useMutateUpdateSale();
    const { deleteSale, loading: loadingDelete } = useMutateDeleteSale();
    const { exportSales, loading: loadingExport } = useMutateExportSales();

    // Estados de filtros
    const [mes, setMes] = useState('');
    const [ano, setAno] = useState('');
    const [dateStart, setDateStart] = useState('');
    const [dateEnd, setDateEnd] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // Estados de modais
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
    const [saleToDelete, setSaleToDelete] = useState<number | null>(null);

    const canModify = isAdmin || isManager;

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, authLoading, router]);

    useEffect(() => {
        if (isAuthenticated) {
            loadSales();
        }
    }, [isAuthenticated, currentPage]);

    const loadSales = async () => {
        try {
            await getAllSales({
                page: currentPage,
                limit: 50,
                mes: mes ? Number(mes) : undefined,
                ano: ano ? Number(ano) : undefined,
                dataInicio: dateStart || undefined,
                dataFim: dateEnd || undefined,
            });
        } catch (error) {
            // Erro já tratado no hook
        }
    };

    const handleSearch = () => {
        setCurrentPage(1);
        loadSales();
    };

    const handleClearFilters = () => {
        setMes('');
        setAno('');
        setDateStart('');
        setDateEnd('');
        setCurrentPage(1);
        setTimeout(() => {
            getAllSales({ page: 1, limit: 50 });
        }, 100);
    };

    const handleExport = async () => {
        try {
            await exportSales({
                mes: mes ? Number(mes) : undefined,
                ano: ano ? Number(ano) : undefined,
                dataInicio: dateStart || undefined,
                dataFim: dateEnd || undefined,
            });
        } catch (error) {
            // Erro já tratado no hook
        }
    };

    const handleOpenModal = (sale?: Sale) => {
        setSelectedSale(sale || null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedSale(null);
    };

    const handleSubmit = async (data: SaleFormData) => {
        try {
            const apiData = {
                data: data.data,
                totalCartao: typeof data.totalCartao === 'number' ? data.totalCartao : undefined,
                totalPix: typeof data.totalPix === 'number' ? data.totalPix : undefined,
                totalEspecie: typeof data.totalEspecie === 'number' ? data.totalEspecie : undefined,
                totalOutro: typeof data.totalOutro === 'number' ? data.totalOutro : undefined,
            };

            if (selectedSale) {
                await updateSale(selectedSale.idVenda, apiData);
            } else {
                await createSale(apiData);
            }
            handleCloseModal();
            loadSales();
        } catch (error) {
            // Erro já tratado no hook
        }
    };

    const handleOpenDeleteModal = (id: number) => {
        setSaleToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setSaleToDelete(null);
    };

    const handleConfirmDelete = async () => {
        if (saleToDelete) {
            try {
                await deleteSale(saleToDelete);
                handleCloseDeleteModal();
                loadSales();
            } catch (error) {
                // Erro já tratado no hook
            }
        }
    };

    const calculateTotals = () => {
        const totals = sales.reduce(
            (acc, sale) => {
                acc.totalCartao += parseFloat(sale.totalCartao);
                acc.totalPix += parseFloat(sale.totalPix);
                acc.totalEspecie += parseFloat(sale.totalEspecie);
                acc.totalOutro += parseFloat(sale.totalOutro);
                acc.totalGeral += parseFloat(sale.totalDia);
                return acc;
            },
            { totalCartao: 0, totalPix: 0, totalEspecie: 0, totalOutro: 0, totalGeral: 0 }
        );
        return totals;
    };

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

    const totals = calculateTotals();

    return (
        <>
            <Head>
                <title>Vendas - Casa Alves</title>
            </Head>

            <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-6 sm:mb-8">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex items-center space-x-3">
                                <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex-shrink-0">
                                    <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                                </div>
                                <div className="min-w-0">
                                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Vendas</h1>
                                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                                        Gerencie e acompanhe todas as vendas
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                {canModify && (
                                    <Button
                                        onClick={handleExport}
                                        variant="secondary"
                                        disabled={loadingExport}
                                        className="flex-1 sm:flex-none"
                                    >
                                        <Download className="w-4 h-4 mr-2" />
                                        {loadingExport ? 'Exportando...' : 'Exportar'}
                                    </Button>
                                )}
                                {canModify && (
                                    <Button
                                        onClick={() => handleOpenModal()}
                                        className="flex-1 sm:flex-none"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Nova Venda
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Estatísticas */}
                    {sales.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <Card>
                                <CardContent className="py-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-500">Total de Vendas</p>
                                            <p className="text-2xl font-bold text-gray-900">{pagination.total}</p>
                                        </div>
                                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                            <ShoppingCart className="w-6 h-6 text-blue-600" />
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
                                            <File className="w-6 h-6 text-green-600" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="py-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-500">Vendas na Página</p>
                                            <p className="text-2xl font-bold text-gray-900">{sales.length}</p>
                                        </div>
                                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                                            <BarChart3 className="w-6 h-6 text-purple-600" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Filtros */}
                    <Card className="mb-6">
                        <CardContent className="py-4">
                            <SalesFilters
                                mes={mes}
                                ano={ano}
                                dateStart={dateStart}
                                dateEnd={dateEnd}
                                onMesChange={setMes}
                                onAnoChange={setAno}
                                onDateStartChange={setDateStart}
                                onDateEndChange={setDateEnd}
                                onSearch={handleSearch}
                                onClearFilters={handleClearFilters}
                            />
                        </CardContent>
                    </Card>

                    {/* Tabela de Vendas */}
                    <Card>
                        <CardContent className="p-0">
                            <SalesTable
                                sales={sales}
                                loading={loadingSales}
                                onEdit={handleOpenModal}
                                onDelete={handleOpenDeleteModal}
                                canModify={canModify}
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

            {/* Modais */}
            <SaleModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleSubmit}
                loading={loadingCreate || loadingUpdate}
                sale={selectedSale}
            />

            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={handleCloseDeleteModal}
                onConfirm={handleConfirmDelete}
                loading={loadingDelete}
                title="Excluir Venda"
                message="Tem certeza que deseja excluir esta venda? Esta ação não pode ser desfeita."
                buttonText="Excluir Venda"
            />
        </>
    );
}
