import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';
import { maskCpfCnpj } from '../utils/formatters';

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

interface InvoiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: InvoiceFormData) => void;
    loading: boolean;
    invoice?: Invoice | null;
}

export interface InvoiceFormData {
    data: string;
    valor?: number;
    dataVencimento: string;
    dataPagamento?: string;
    status?: string;
    formaPagamento?: string;
    nomeFornecedor: string;
    documentoFornecedor: string;
    descricao: string;
}

export function InvoiceModal({ isOpen, onClose, onSubmit, loading, invoice }: InvoiceModalProps) {
    const [formData, setFormData] = useState<InvoiceFormData>({
        data: '',
        valor: 0,
        dataVencimento: '',
        dataPagamento: '',
        status: '',
        formaPagamento: '',
        nomeFornecedor: '',
        documentoFornecedor: '',
        descricao: '',
    });

    useEffect(() => {
        if (invoice) {
            setFormData({
                data: invoice.data.split('T')[0],
                valor: parseFloat(invoice.valor),
                dataVencimento: invoice.dataVencimento.split('T')[0],
                dataPagamento: invoice.dataPagamento ? invoice.dataPagamento.split('T')[0] : '',
                status: typeof invoice.status === 'boolean' ? (invoice.status ? 'pago' : 'pendente') : invoice.status,
                formaPagamento: invoice.formaPagamento || '',
                nomeFornecedor: invoice.nomeFornecedor,
                documentoFornecedor: invoice.documentoFornecedor,
                descricao: invoice.descricao,
            });
        } else {
            setFormData({
                data: '',
                valor: 0,
                dataVencimento: '',
                dataPagamento: '',
                status: '',
                formaPagamento: '',
                nomeFornecedor: '',
                documentoFornecedor: '',
                descricao: '',
            });
        }
    }, [invoice, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Preparar dados para envio
        const submitData: InvoiceFormData = {
            data: formData.data,
            dataVencimento: formData.dataVencimento,
            nomeFornecedor: formData.nomeFornecedor,
            documentoFornecedor: formData.documentoFornecedor,
            descricao: formData.descricao,
        };

        // Adicionar campos opcionais apenas se tiverem valor
        if (formData.valor && formData.valor > 0) {
            submitData.valor = formData.valor;
        }
        if (formData.dataPagamento) {
            submitData.dataPagamento = formData.dataPagamento;
        }
        if (formData.status !== undefined) {
            submitData.status = formData.status;
        }
        if (formData.formaPagamento) {
            submitData.formaPagamento = formData.formaPagamento;
        }

        onSubmit(submitData);
    };

    const formatCurrency = (value: number) => {
        if (isNaN(value)) return 'R$ 0,00';
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
                <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

                <div className="relative inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-semibold text-gray-900">
                            {invoice ? 'Editar Invoice' : 'Nova Invoice'}
                        </h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-500 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Data <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    type="date"
                                    value={formData.data}
                                    onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Data de Vencimento <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    type="date"
                                    value={formData.dataVencimento}
                                    onChange={(e) => setFormData({ ...formData, dataVencimento: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nome do Fornecedor <span className="text-red-500">*</span>
                            </label>
                            <Input
                                type="text"
                                value={formData.nomeFornecedor}
                                onChange={(e) => setFormData({ ...formData, nomeFornecedor: e.target.value })}
                                placeholder="Nome do fornecedor"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Documento do Fornecedor (CPF/CNPJ) <span className="text-red-500">*</span>
                            </label>
                            <Input
                                type="text"
                                value={formData.documentoFornecedor}
                                onChange={(e) => setFormData({ ...formData, documentoFornecedor: maskCpfCnpj(e.target.value) })}
                                placeholder="CPF/CNPJ"
                                maxLength={18}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Descrição <span className="text-red-500">*</span>
                            </label>
                            <Input
                                type="text"
                                value={formData.descricao}
                                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                                placeholder="Descrição da Duplicata"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Valor (R$)
                            </label>
                            <Input
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.valor}
                                onChange={(e) => setFormData({ ...formData, valor: parseFloat(e.target.value) || 0 })}
                                placeholder="0.00"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Data de Pagamento
                                </label>
                                <Input
                                    type="date"
                                    value={formData.dataPagamento}
                                    onChange={(e) => setFormData({ ...formData, dataPagamento: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Forma de Pagamento
                                </label>
                                <select
                                    value={formData.formaPagamento}
                                    onChange={(e) => setFormData({ ...formData, formaPagamento: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                >
                                    <option value="">Selecione a forma de pagamento</option>
                                    <option value="Boleto">Boleto</option>
                                    <option value="PIX">PIX</option>
                                    <option value="DDA">DDA</option>
                                    <option value="Débito">Débito</option>
                                    <option value="Automático">Automático</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Status
                            </label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            >
                                <option value="">Selecione o status</option>
                                <option value="agendado">Agendado</option>
                                <option value="pago">Pago</option>
                                <option value="pendente">Pendente</option>
                                <option value="aguardando boleto">Aguardando Boleto</option>
                            </select>
                        </div>

                        {formData.valor !== undefined && formData.valor > 0 && (
                            <div className="pt-4 border-t border-gray-200">
                                <div className="flex items-center justify-between">
                                    <span className="text-lg font-semibold text-gray-700">Valor:</span>
                                    <span className="text-2xl font-bold text-orange-600">{formatCurrency(formData.valor)}</span>
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-3 pt-4">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={onClose}
                                className="flex-1"
                                disabled={loading}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                className="flex-1"
                                disabled={loading}
                            >
                                {loading ? 'Salvando...' : invoice ? 'Atualizar' : 'Cadastrar'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

