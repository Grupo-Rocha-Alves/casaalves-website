import { Loader2, Receipt, Edit, Trash2, Calendar, Tag, FileText, DollarSign } from 'lucide-react';
import { Button } from './Button';

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

interface ExpensesTableProps {
    expenses: Expense[];
    loading: boolean;
    onEdit: (expense: Expense) => void;
    onDelete: (id: number) => void;
    canModify: boolean;
}

export function ExpensesTable({ expenses, loading, onEdit, onDelete, canModify }: ExpensesTableProps) {
    const formatDate = (dateString: string) => {
        // Extrai apenas a parte da data (YYYY-MM-DD)
        const dateOnly = dateString.split('T')[0];
        const [year, month, day] = dateOnly.split('-');
        // Retorna no formato dd/mm/yyyy
        return `${day}/${month}/${year}`;
    };

    const formatCurrency = (value: string) => {
        return parseFloat(value).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-orange-600 animate-spin" />
            </div>
        );
    }

    if (expenses.length === 0) {
        return (
            <div className="text-center py-12">
                <Receipt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Nenhuma despesa encontrada</p>
            </div>
        );
    }

    return (
        <>
            {/* Layout Mobile - Cards */}
            <div className="md:hidden space-y-2.5 px-1 py-3">
                {expenses.map((expense) => (
                    <div key={expense.idDespesa} className="bg-white border border-gray-200 rounded-lg p-3 space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-mono text-gray-500">#{expense.idDespesa}</span>
                            <div className="flex items-center space-x-2">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                <span className="text-sm font-medium text-gray-900">{formatDate(expense.data)}</span>
                            </div>
                        </div>

                        <div className="pt-2 border-t border-gray-100 space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500">Dia da Semana</span>
                                <span className="text-sm font-medium text-gray-700">{expense.diaSemana}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500">Tipo</span>
                                <span className="text-sm font-medium text-gray-700">{expense.tipo}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500">Categoria</span>
                                <span className="text-sm font-medium text-gray-700">{expense.categoria}</span>
                            </div>
                        </div>

                        <div className="pt-2 border-t border-gray-100">
                            <div className="flex items-start space-x-2">
                                <FileText className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-gray-500 mb-1">Descrição</p>
                                    <p className="text-sm text-gray-900 break-words">{expense.descricao}</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-2 border-t-2 border-gray-200">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center space-x-2">
                                    <DollarSign className="w-5 h-5 text-orange-600" />
                                    <span className="text-sm font-semibold text-gray-700">Valor</span>
                                </div>
                                <span className="text-lg font-bold text-orange-600">{formatCurrency(expense.valor)}</span>
                            </div>
                        </div>

                        {canModify && (
                            <div className="flex gap-2 pt-2 border-t border-gray-100">
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => onEdit(expense)}
                                    className="flex-1"
                                >
                                    <Edit className="w-4 h-4 mr-1" />
                                    Editar
                                </Button>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => onDelete(expense.idDespesa)}
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
                                Dia
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tipo
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Categoria
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ maxWidth: '260px' }}>
                                Descrição
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Valor
                            </th>
                            {canModify && (
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Ações
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {expenses.map((expense) => (
                            <tr key={expense.idDespesa} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                                    #{expense.idDespesa}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center space-x-2">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm text-gray-900">{formatDate(expense.data)}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    {expense.diaSemana}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center space-x-2">
                                        <Tag className="w-4 h-4 text-blue-500" />
                                        <span className="text-sm text-gray-900">{expense.tipo}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center space-x-2">
                                        <Tag className="w-4 h-4 text-purple-500" />
                                        <span className="text-sm text-gray-900">{expense.categoria}</span>
                                    </div>
                                </td>
                                <td
                                    className="px-6 py-4 text-sm text-gray-700 cursor-help"
                                    title={expense.descricao}
                                    style={{ maxWidth: '256px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                                >
                                    {expense.descricao}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold text-orange-600">
                                    {formatCurrency(expense.valor)}
                                </td>
                                {canModify && (
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <div className="flex items-center justify-center space-x-2">
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                onClick={() => onEdit(expense)}
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                onClick={() => onDelete(expense.idDespesa)}
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
