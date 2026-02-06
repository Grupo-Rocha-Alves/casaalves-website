import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import { Button } from '../components/Button';
import { Card, CardContent } from '../components/Card';
import Head from 'next/head';
import { useQueryGetAllInvoices } from '../hooks/useQueryGetAllInvoices';
import { useMutateCreateInvoice } from '../hooks/mutations/useMutateCreateInvoice';
import { useMutateUpdateInvoice } from '../hooks/mutations/useMutateUpdateInvoice';
import { useMutateDeleteInvoice } from '../hooks/mutations/useMutateDeleteInvoice';
import { useMutateExportInvoices } from '../hooks/mutations/useMutateExportInvoices';
import { InvoicesFilters } from '../components/InvoicesFilters';
import { InvoicesTable } from '../components/InvoicesTable';
import { InvoiceModal, InvoiceFormData } from '../components/InvoiceModal';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import { Pagination } from '../components/Pagination';
import { FileText, Download, Plus, File, BarChart3 } from 'lucide-react';
import toast from 'react-hot-toast';

interface Invoice {
    idDuplicata: number;
    data: string;
    mes: number;
    ano: number;
    diaSemana: string;
    valor: string;
    dataVencimento: string;
    dataPagamento: string | null;
    status: boolean | string;
    formaPagamento: string | null;
    nomeFornecedor: string;
    documentoFornecedor: string;
    descricao: string;
}

export default function Invoices() {
    const { user, isAuthenticated, loading: authLoading, isAdmin, isManager } = useAuth();
    const router = useRouter();
    const { invoices, pagination, loading: loadingInvoices, getAllInvoices } = useQueryGetAllInvoices();
    const { createInvoice, loading: loadingCreate } = useMutateCreateInvoice();
    const { updateInvoice, loading: loadingUpdate } = useMutateUpdateInvoice();
    const { deleteInvoice, loading: loadingDelete } = useMutateDeleteInvoice();
    const { exportInvoices, loading: loadingExport } = useMutateExportInvoices();

    // Estados de filtros
    const [mes, setMes] = useState('');
    const [ano, setAno] = useState('');
    const [status, setStatus] = useState('');
    const [nomeFornecedor, setNomeFornecedor] = useState('');
    const [documentoFornecedor, setDocumentoFornecedor] = useState('');
    const [formaPagamento, setFormaPagamento] = useState('');
    const [dataInicio, setDataInicio] = useState('');
    const [dataFim, setDataFim] = useState('');
    const [dataVencimentoInicio, setDataVencimentoInicio] = useState('');
    const [dataVencimentoFim, setDataVencimentoFim] = useState('');
    const [dataPagamentoInicio, setDataPagamentoInicio] = useState('');
    const [dataPagamentoFim, setDataPagamentoFim] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // Estados de modais
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
    const [invoiceToDelete, setInvoiceToDelete] = useState<number | null>(null);

    const canModify = isAdmin || isManager;

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, authLoading, router]);

    useEffect(() => {
        if (isAuthenticated) {
            loadInvoices();
        }
    }, [isAuthenticated, currentPage]);

    const loadInvoices = async () => {
        try {
            await getAllInvoices({
                page: currentPage,
                limit: 50,
                mes: mes ? Number(mes) : undefined,
                ano: ano ? Number(ano) : undefined,
                status: status || undefined,
                nomeFornecedor: nomeFornecedor || undefined,
                documentoFornecedor: documentoFornecedor || undefined,
                formaPagamento: formaPagamento || undefined,
                dataInicio: dataInicio || undefined,
                dataFim: dataFim || undefined,
                dataVencimentoInicio: dataVencimentoInicio || undefined,
                dataVencimentoFim: dataVencimentoFim || undefined,
                dataPagamentoInicio: dataPagamentoInicio || undefined,
                dataPagamentoFim: dataPagamentoFim || undefined,
            });
        } catch (error) {
            // Erro já tratado no hook
        }
    };

    const handleSearch = () => {
        setCurrentPage(1);
        loadInvoices();
    };

    const handleClearFilters = () => {
        setMes('');
        setAno('');
        setStatus('');
        setNomeFornecedor('');
        setDocumentoFornecedor('');
        setFormaPagamento('');
        setDataInicio('');
        setDataFim('');
        setDataVencimentoInicio('');
        setDataVencimentoFim('');
        setDataPagamentoInicio('');
        setDataPagamentoFim('');
        setCurrentPage(1);
        setTimeout(() => {
            getAllInvoices({ page: 1, limit: 50 });
        }, 100);
    };

    const handleExport = async () => {
        try {
            await exportInvoices({
                mes: mes ? Number(mes) : undefined,
                ano: ano ? Number(ano) : undefined,
                status: status || undefined,
                nomeFornecedor: nomeFornecedor || undefined,
                documentoFornecedor: documentoFornecedor || undefined,
                formaPagamento: formaPagamento || undefined,
                dataInicio: dataInicio || undefined,
                dataFim: dataFim || undefined,
                dataVencimentoInicio: dataVencimentoInicio || undefined,
                dataVencimentoFim: dataVencimentoFim || undefined,
                dataPagamentoInicio: dataPagamentoInicio || undefined,
                dataPagamentoFim: dataPagamentoFim || undefined,
            });
        } catch (error) {
            // Erro já tratado no hook
        }
    };

    const handleOpenModal = (invoice?: Invoice) => {
        setSelectedInvoice(invoice || null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedInvoice(null);
    };

    const handleSubmit = async (data: InvoiceFormData) => {
        try {
            if (selectedInvoice && selectedInvoice.idDuplicata) {
                await updateInvoice(selectedInvoice.idDuplicata, data);
            } else if (!selectedInvoice) {
                await createInvoice(data);
            } else {
                console.error('Invoice object:', selectedInvoice);
                toast.error('Erro: ID da duplicata não encontrado');
                return;
            }
            handleCloseModal();
            loadInvoices();
        } catch (error) {
            // Erro já tratado no hook
        }
    };

    const handleOpenDeleteModal = (id: number) => {
        setInvoiceToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setInvoiceToDelete(null);
    };

    const handleConfirmDelete = async () => {
        if (invoiceToDelete) {
            try {
                await deleteInvoice(invoiceToDelete);
                handleCloseDeleteModal();
                loadInvoices();
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
                <title>Duplicatas - Casa Alves</title>
            </Head>

            <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-6 sm:mb-8">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex items-center space-x-3">
                                <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex-shrink-0">
                                    <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                                </div>
                                <div className="min-w-0">
                                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Duplicatas</h1>
                                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                                        Gerencie e acompanhe todas as Duplicatas
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
                                        Nova Duplicata
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Estatísticas */}
                    {invoices.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <Card>
                                <CardContent className="py-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-500">Total de Duplicatas</p>
                                            <p className="text-2xl font-bold text-gray-900">{pagination.total}</p>
                                        </div>
                                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                            <FileText className="w-6 h-6 text-blue-600" />
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
                                            <p className="text-sm text-gray-500">Duplicatas na Página</p>
                                            <p className="text-2xl font-bold text-gray-900">{invoices.length}</p>
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
                            <InvoicesFilters
                                mes={mes}
                                ano={ano}
                                status={status}
                                nomeFornecedor={nomeFornecedor}
                                documentoFornecedor={documentoFornecedor}
                                formaPagamento={formaPagamento}
                                dataInicio={dataInicio}
                                dataFim={dataFim}
                                dataVencimentoInicio={dataVencimentoInicio}
                                dataVencimentoFim={dataVencimentoFim}
                                dataPagamentoInicio={dataPagamentoInicio}
                                dataPagamentoFim={dataPagamentoFim}
                                onMesChange={setMes}
                                onAnoChange={setAno}
                                onStatusChange={setStatus}
                                onNomeFornecedorChange={setNomeFornecedor}
                                onDocumentoFornecedorChange={setDocumentoFornecedor}
                                onFormaPagamentoChange={setFormaPagamento}
                                onDataInicioChange={setDataInicio}
                                onDataFimChange={setDataFim}
                                onDataVencimentoInicioChange={setDataVencimentoInicio}
                                onDataVencimentoFimChange={setDataVencimentoFim}
                                onDataPagamentoInicioChange={setDataPagamentoInicio}
                                onDataPagamentoFimChange={setDataPagamentoFim}
                                onSearch={handleSearch}
                                onClearFilters={handleClearFilters}
                            />
                        </CardContent>
                    </Card>

                    {/* Tabela de Invoices */}
                    <Card>
                        <CardContent className="p-0">
                            <InvoicesTable
                                invoices={invoices}
                                loading={loadingInvoices}
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
            <InvoiceModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleSubmit}
                loading={loadingCreate || loadingUpdate}
                invoice={selectedInvoice}
            />

            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={handleCloseDeleteModal}
                onConfirm={handleConfirmDelete}
                loading={loadingDelete}
                title="Excluir Duplicata"
                message="Tem certeza que deseja excluir esta Duplicata? Esta ação não pode ser desfeita."
                buttonText="Excluir Duplicata"
            />
        </>
    );
}
