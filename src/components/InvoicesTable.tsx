import { Loader2, FileText, Edit, Trash2, Calendar, User, DollarSign, CreditCard, CheckCircle, XCircle } from 'lucide-react';
import { Button } from './Button';
import { Tooltip } from './Tooltip';
import { formatCpfCnpj } from '../utils/formatters';

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

interface InvoicesTableProps {
    invoices: Invoice[];
    loading: boolean;
    onEdit: (invoice: Invoice) => void;
    onDelete: (id: number) => void;
    canModify: boolean;
}

export function InvoicesTable({ invoices, loading, onEdit, onDelete, canModify }: InvoicesTableProps) {
    const formatDate = (dateString: string | null) => {
        if (!dateString) return '-';
        const dateOnly = dateString.split('T')[0];
        const [year, month, day] = dateOnly.split('-');
        return `${day}/${month}/${year}`;
    };

    const formatCurrency = (value: string) => {
        return parseFloat(value).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        });
    };

    const getStatusBadge = (status: string | boolean | null | undefined) => {
        const statusConfig: Record<string, { label: string; bgColor: string; textColor: string; icon: any }> = {
            'pago': {
                label: 'Pago',
                bgColor: 'bg-green-100',
                textColor: 'text-green-800',
                icon: CheckCircle
            },
            'pendente': {
                label: 'Pendente',
                bgColor: 'bg-red-100',
                textColor: 'text-red-800',
                icon: XCircle
            },
            'agendado': {
                label: 'Agendado',
                bgColor: 'bg-blue-100',
                textColor: 'text-blue-800',
                icon: CheckCircle
            },
            'aguardando boleto': {
                label: 'Aguardando Boleto',
                bgColor: 'bg-yellow-100',
                textColor: 'text-yellow-800',
                icon: XCircle
            }
        };

        let normalizedStatus = 'pendente';
        try {
            // Convert boolean to string if needed
            let statusStr = status;
            if (typeof status === 'boolean') {
                statusStr = status ? 'pago' : 'pendente';
            }
            
            if (statusStr && typeof statusStr === 'string') {
                normalizedStatus = statusStr.toLowerCase().trim();
            }
        } catch (e) {
            normalizedStatus = 'pendente';
        }
        
        const config = statusConfig[normalizedStatus] || statusConfig['pendente'];
        const Icon = config?.icon || XCircle;

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor}`}>
                <Icon className="w-3 h-3 mr-1" />
                {config.label}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-orange-600 animate-spin" />
            </div>
        );
    }

    if (invoices.length === 0) {
        return (
            <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Nenhuma Invoice encontrada</p>
            </div>
        );
    }

    return (
        <>
            {/* Layout Mobile - Cards */}
            <div className="md:hidden space-y-2.5 px-1 py-3">
                {invoices.map((invoice) => (
                    <div key={invoice.idDuplicata} className="bg-white border border-gray-200 rounded-lg p-3 space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-mono text-gray-500">#{invoice.idDuplicata}</span>
                            <div className="flex items-center space-x-2">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                <span className="text-sm font-medium text-gray-900">{formatDate(invoice.data)}</span>
                            </div>
                        </div>

                        <div className="pt-2 border-t border-gray-100 space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500">Status</span>
                                {getStatusBadge(invoice.status)}
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500">Fornecedor</span>
                                <span className="text-sm font-medium text-gray-700">{invoice.nomeFornecedor}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500">Documento</span>
                                <span className="text-sm font-medium text-gray-700">{formatCpfCnpj(invoice.documentoFornecedor)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500">Vencimento</span>
                                <span className="text-sm font-medium text-gray-700">{formatDate(invoice.dataVencimento)}</span>
                            </div>
                            {invoice.dataPagamento && (
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-500">Pagamento</span>
                                    <span className="text-sm font-medium text-gray-700">{formatDate(invoice.dataPagamento)}</span>
                                </div>
                            )}
                            {invoice.formaPagamento && (
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-500">Forma Pagamento</span>
                                    <span className="text-sm font-medium text-gray-700">{invoice.formaPagamento}</span>
                                </div>
                            )}
                        </div>

                        <div className="pt-2 border-t border-gray-100">
                            <div className="flex items-start space-x-2">
                                <FileText className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-gray-500 mb-1">Descrição</p>
                                    <p className="text-sm text-gray-900 break-words">{invoice.descricao}</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-2 border-t-2 border-gray-200">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center space-x-2">
                                    <DollarSign className="w-5 h-5 text-orange-600" />
                                    <span className="text-sm font-semibold text-gray-700">Valor</span>
                                </div>
                                <span className="text-lg font-bold text-orange-600">{formatCurrency(invoice.valor)}</span>
                            </div>
                        </div>

                        {canModify && (
                            <div className="flex gap-2 pt-2 border-t border-gray-100">
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => onEdit(invoice)}
                                    className="flex-1"
                                >
                                    <Edit className="w-4 h-4 mr-1" />
                                    Editar
                                </Button>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => onDelete(invoice.idDuplicata)}
                                    className="flex-1 text-red-600 hover:bg-red-50"
                                >
                                    <Trash2 className="w-4 h-4 mr-1" />
                                    Excluir
                                </Button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Layout Desktop - Tabela */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Data
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Fornecedor
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Descrição
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Valor
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Vencimento
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Pagamento
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            {canModify && (
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Ações
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {invoices.map((invoice) => (
                            <tr key={invoice.idDuplicata} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                                    #{invoice.idDuplicata}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center space-x-2">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm text-gray-900">{formatDate(invoice.data)}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-start space-x-2">
                                        <User className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">{invoice.nomeFornecedor}</div>
                                            <div className="text-xs text-gray-500">{formatCpfCnpj(invoice.documentoFornecedor)}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <Tooltip content={invoice.descricao}>
                                        <div 
                                            className="text-sm text-gray-700 cursor-help"
                                            style={{ maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                                        >
                                            {invoice.descricao}
                                        </div>
                                    </Tooltip>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold text-orange-600">
                                    {formatCurrency(invoice.valor)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    {formatDate(invoice.dataVencimento)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-700">{formatDate(invoice.dataPagamento)}</div>
                                    {invoice.formaPagamento && (
                                        <div className="flex items-center space-x-1 mt-1">
                                            <CreditCard className="w-3 h-3 text-gray-400" />
                                            <span className="text-xs text-gray-500">{invoice.formaPagamento}</span>
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    {getStatusBadge(invoice.status)}
                                </td>
                                {canModify && (
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <div className="flex items-center justify-center space-x-2">
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                onClick={() => onEdit(invoice)}
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                onClick={() => onDelete(invoice.idDuplicata)}
                                                className="text-red-600 hover:bg-red-50"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}

