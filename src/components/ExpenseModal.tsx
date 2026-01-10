import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';

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

interface ExpenseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: ExpenseFormData) => void;
    loading: boolean;
    expense?: Expense | null;
}

export interface ExpenseFormData {
    data: string;
    tipo: string;
    categoria: string;
    descricao: string;
    valor: string;
}

// Tipos de despesas disponíveis (ordenados alfabeticamente)
const EXPENSE_TYPES = [
    'Aquisição Mercadorias',
    'Aquisição Suprimentos',
    'Água e Esgoto',
    'Energia Elétrica',
    'Gás e Combustível',
    'Impostos e Taxas',
    'Retirada de Sócios',
    'Salários e Proventos',
    'Serviços de Manutenção',
    'Serviços Diversos',
    'Telefone Celular',
];

// Função para determinar a categoria com base no tipo
const getCategoryFromType = (tipo: string): string => {
    switch (tipo) {
        case 'Aquisição Mercadorias':
        case 'Aquisição Suprimentos':
            return 'Mercadorias';
        case 'Serviços de Manutenção':
            return 'Manutenção';
        case 'Água e Esgoto':
        case 'Energia Elétrica':
        case 'Gás e Combustível':
        case 'Telefone Celular':
        case 'Serviços Diversos':
            return 'Serviços';
        case 'Impostos e Taxas':
            return 'Impostos';
        case 'Retirada de Sócios':
        case 'Salários e Proventos':
            return 'Proventos';
        default:
            return 'Diversas';
    }
};

export function ExpenseModal({ isOpen, onClose, onSubmit, loading, expense }: ExpenseModalProps) {
    const [formData, setFormData] = useState<ExpenseFormData>({
        data: '',
        tipo: '',
        categoria: '',
        descricao: '',
        valor: '',
    });

    useEffect(() => {
        if (expense) {
            setFormData({
                data: expense.data.split('T')[0], // Converter para formato YYYY-MM-DD
                tipo: expense.tipo,
                categoria: expense.categoria,
                descricao: expense.descricao,
                valor: expense.valor,
            });
        } else {
            setFormData({
                data: '',
                tipo: '',
                categoria: '',
                descricao: '',
                valor: '',
            });
        }
    }, [expense, isOpen]);

    const handleTipoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newTipo = e.target.value;
        const newCategoria = getCategoryFromType(newTipo);
        setFormData({
            ...formData,
            tipo: newTipo,
            categoria: newCategoria
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const formatCurrency = (value: string) => {
        const numValue = parseFloat(value);
        if (isNaN(numValue)) return 'R$ 0,00';
        return numValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
                <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

                <div className="relative inline-block w-full max-w-lg p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-semibold text-gray-900">
                            {expense ? 'Editar Despesa' : 'Nova Despesa'}
                        </h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-500 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
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
                                Tipo <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.tipo}
                                onChange={handleTipoChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            >
                                <option value="">Selecione o tipo</option>
                                {EXPENSE_TYPES.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {formData.categoria && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-blue-700">Categoria:</span>
                                    <span className="text-sm font-semibold text-blue-900">{formData.categoria}</span>
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Descrição <span className="text-red-500">*</span>
                            </label>
                            <Input
                                type="text"
                                value={formData.descricao}
                                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                                placeholder="Descreva a despesa"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Valor (R$) <span className="text-red-500">*</span>
                            </label>
                            <Input
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.valor}
                                onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                                placeholder="0.00"
                                required
                            />
                        </div>

                        {formData.valor && (
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
                                {loading ? 'Salvando...' : expense ? 'Atualizar' : 'Cadastrar'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

