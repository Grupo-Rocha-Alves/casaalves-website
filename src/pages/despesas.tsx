import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import { Button } from '../components/Button';
import { Card, CardContent } from '../components/Card';
import Head from 'next/head';
import { useQueryGetAllExpenses } from '../hooks/useQueryGetAllExpenses';
import { useMutateCreateExpense } from '../hooks/mutations/useMutateCreateExpense';
import { useMutateUpdateExpense } from '../hooks/mutations/useMutateUpdateExpense';
import { useMutateDeleteExpense } from '../hooks/mutations/useMutateDeleteExpense';
import { useMutateExportExpenses } from '../hooks/mutations/useMutateExportExpenses';
import { ExpensesFilters } from '../components/ExpensesFilters';
import { ExpensesTable } from '../components/ExpensesTable';
import { ExpenseModal, ExpenseFormData } from '../components/ExpenseModal';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import { Pagination } from '../components/Pagination';
import { Receipt, Download, Plus, File, BarChart3 } from 'lucide-react';

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

export default function Despesas() {
    const { user, isAuthenticated, loading: authLoading, isAdmin, isManager } = useAuth();
    const router = useRouter();
    const { expenses, pagination, loading: loadingExpenses, getAllExpenses } = useQueryGetAllExpenses();
    const { createExpense, loading: loadingCreate } = useMutateCreateExpense();
    const { updateExpense, loading: loadingUpdate } = useMutateUpdateExpense();
    const { deleteExpense, loading: loadingDelete } = useMutateDeleteExpense();
    const { exportExpenses, loading: loadingExport } = useMutateExportExpenses();

    // Estados de filtros
    const [mes, setMes] = useState('');
    const [ano, setAno] = useState('');
    const [tipo, setTipo] = useState('');
    const [categoria, setCategoria] = useState('');
    const [dateStart, setDateStart] = useState('');
    const [dateEnd, setDateEnd] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // Estados de modais
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
    const [expenseToDelete, setExpenseToDelete] = useState<number | null>(null);

    const canModify = isAdmin || isManager;

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, authLoading, router]);

    useEffect(() => {
        if (isAuthenticated) {
            loadExpenses();
        }
    }, [isAuthenticated, currentPage]);

    const loadExpenses = async () => {
        try {
            await getAllExpenses({
                page: currentPage,
                limit: 50,
                mes: mes ? Number(mes) : undefined,
                ano: ano ? Number(ano) : undefined,
                tipo: tipo || undefined,
                categoria: categoria || undefined,
                dataInicio: dateStart || undefined,
                dataFim: dateEnd || undefined,
            });
        } catch (error) {
            // Erro já tratado no hook
        }
    };

    const handleSearch = () => {
        setCurrentPage(1);
        loadExpenses();
    };

    const handleClearFilters = () => {
        setMes('');
        setAno('');
        setTipo('');
        setCategoria('');
        setDateStart('');
        setDateEnd('');
        setCurrentPage(1);
        setTimeout(() => {
            getAllExpenses({ page: 1, limit: 50 });
        }, 100);
    };

    const handleExport = async () => {
        try {
            await exportExpenses({
                mes: mes ? Number(mes) : undefined,
                ano: ano ? Number(ano) : undefined,
                tipo: tipo || undefined,
                categoria: categoria || undefined,
                dataInicio: dateStart || undefined,
                dataFim: dateEnd || undefined,
            });
        } catch (error) {
            // Erro já tratado no hook
        }
    };

    const handleOpenModal = (expense?: Expense) => {
        setSelectedExpense(expense || null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedExpense(null);
    };

    const handleSubmit = async (data: ExpenseFormData) => {
        try {
            if (selectedExpense) {
                await updateExpense(selectedExpense.idDespesa, data);
            } else {
                await createExpense(data);
            }
            handleCloseModal();
            loadExpenses();
        } catch (error) {
            // Erro já tratado no hook
        }
    };

    const handleOpenDeleteModal = (id: number) => {
        setExpenseToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setExpenseToDelete(null);
    };

    const handleConfirmDelete = async () => {
        if (expenseToDelete) {
            try {
                await deleteExpense(expenseToDelete);
                handleCloseDeleteModal();
                loadExpenses();
            } catch (error) {
                // Erro já tratado no hook
            }
        }
    };



    if (authLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
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
                <title>Despesas - Casa Alves</title>
            </Head>

            <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-6 sm:mb-8">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex items-center space-x-3">
                                <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex-shrink-0">
                                    <Receipt className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                                </div>
                                <div className="min-w-0">
                                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Despesas</h1>
                                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                                        Gerencie e acompanhe todas as despesas
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
                                        Nova Despesa
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Estatísticas */}
                    {expenses.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <Card>
                                <CardContent className="py-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-500">Total de Despesas</p>
                                            <p className="text-2xl font-bold text-gray-900">{pagination.total}</p>
                                        </div>
                                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                            <Receipt className="w-6 h-6 text-blue-600" />
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
                                            <p className="text-sm text-gray-500">Despesas na Página</p>
                                            <p className="text-2xl font-bold text-gray-900">{expenses.length}</p>
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
                            <ExpensesFilters
                                mes={mes}
                                ano={ano}
                                tipo={tipo}
                                categoria={categoria}
                                dateStart={dateStart}
                                dateEnd={dateEnd}
                                onMesChange={setMes}
                                onAnoChange={setAno}
                                onTipoChange={setTipo}
                                onCategoriaChange={setCategoria}
                                onDateStartChange={setDateStart}
                                onDateEndChange={setDateEnd}
                                onSearch={handleSearch}
                                onClearFilters={handleClearFilters}
                            />
                        </CardContent>
                    </Card>

                    {/* Tabela de Despesas */}
                    <Card>
                        <CardContent className="p-0">
                            <ExpensesTable
                                expenses={expenses}
                                loading={loadingExpenses}
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
            <ExpenseModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleSubmit}
                loading={loadingCreate || loadingUpdate}
                expense={selectedExpense}
            />

            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={handleCloseDeleteModal}
                onConfirm={handleConfirmDelete}
                loading={loadingDelete}
                title="Excluir Despesa"
                message="Tem certeza que deseja excluir esta despesa? Esta ação não pode ser desfeita."
                buttonText="Excluir Despesa"
            />
        </>
    );
}
