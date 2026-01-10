import { Button } from './Button';
import { Input } from './Input';
import { Search, X } from 'lucide-react';

interface ExpensesFiltersProps {
    mes: string;
    ano: string;
    tipo: string;
    categoria: string;
    dateStart: string;
    dateEnd: string;
    onMesChange: (value: string) => void;
    onAnoChange: (value: string) => void;
    onTipoChange: (value: string) => void;
    onCategoriaChange: (value: string) => void;
    onDateStartChange: (value: string) => void;
    onDateEndChange: (value: string) => void;
    onSearch: () => void;
    onClearFilters: () => void;
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

// Categorias de despesas disponíveis (ordenadas alfabeticamente)
const EXPENSE_CATEGORIES = [
    'Diversas',
    'Impostos',
    'Manutenção',
    'Mercadorias',
    'Proventos',
    'Serviços',
];

export function ExpensesFilters({
    mes,
    ano,
    tipo,
    categoria,
    dateStart,
    dateEnd,
    onMesChange,
    onAnoChange,
    onTipoChange,
    onCategoriaChange,
    onDateStartChange,
    onDateEndChange,
    onSearch,
    onClearFilters,
}: ExpensesFiltersProps) {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 2024 + 1 }, (_, i) => 2024 + i);
    const months = [
        { value: '1', label: 'Janeiro' },
        { value: '2', label: 'Fevereiro' },
        { value: '3', label: 'Março' },
        { value: '4', label: 'Abril' },
        { value: '5', label: 'Maio' },
        { value: '6', label: 'Junho' },
        { value: '7', label: 'Julho' },
        { value: '8', label: 'Agosto' },
        { value: '9', label: 'Setembro' },
        { value: '10', label: 'Outubro' },
        { value: '11', label: 'Novembro' },
        { value: '12', label: 'Dezembro' },
    ];

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mês
                    </label>
                    <select
                        value={mes}
                        onChange={(e) => onMesChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                        <option value="">Todos os meses</option>
                        {months.map((month) => (
                            <option key={month.value} value={month.value}>
                                {month.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ano
                    </label>
                    <select
                        value={ano}
                        onChange={(e) => onAnoChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                        <option value="">Todos os anos</option>
                        {years.map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tipo
                    </label>
                    <select
                        value={tipo}
                        onChange={(e) => onTipoChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                        <option value="">Todos os tipos</option>
                        {EXPENSE_TYPES.map((type) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Categoria
                    </label>
                    <select
                        value={categoria}
                        onChange={(e) => onCategoriaChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                        <option value="">Todas as categorias</option>
                        {EXPENSE_CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Data Início
                    </label>
                    <Input
                        type="date"
                        value={dateStart}
                        onChange={(e) => onDateStartChange(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Data Fim
                    </label>
                    <Input
                        type="date"
                        value={dateEnd}
                        onChange={(e) => onDateEndChange(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={onSearch} className="flex-1 sm:flex-none">
                    <Search className="w-4 h-4 mr-2" />
                    Filtrar
                </Button>
                <Button onClick={onClearFilters} variant="secondary" className="flex-1 sm:flex-none">
                    <X className="w-4 h-4 mr-2" />
                    Limpar Filtros
                </Button>
            </div>
        </div>
    );
}

