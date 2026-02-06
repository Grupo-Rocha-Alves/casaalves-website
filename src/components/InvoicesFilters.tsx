import { Button } from './Button';
import { Input } from './Input';
import { Search, X } from 'lucide-react';
import { maskCpfCnpj } from '../utils/formatters';

interface InvoicesFiltersProps {
    mes: string;
    ano: string;
    status: string;
    nomeFornecedor: string;
    documentoFornecedor: string;
    formaPagamento: string;
    dataInicio: string;
    dataFim: string;
    dataVencimentoInicio: string;
    dataVencimentoFim: string;
    dataPagamentoInicio: string;
    dataPagamentoFim: string;
    onMesChange: (value: string) => void;
    onAnoChange: (value: string) => void;
    onStatusChange: (value: string) => void;
    onNomeFornecedorChange: (value: string) => void;
    onDocumentoFornecedorChange: (value: string) => void;
    onFormaPagamentoChange: (value: string) => void;
    onDataInicioChange: (value: string) => void;
    onDataFimChange: (value: string) => void;
    onDataVencimentoInicioChange: (value: string) => void;
    onDataVencimentoFimChange: (value: string) => void;
    onDataPagamentoInicioChange: (value: string) => void;
    onDataPagamentoFimChange: (value: string) => void;
    onSearch: () => void;
    onClearFilters: () => void;
}

export function InvoicesFilters({
    mes,
    ano,
    status,
    nomeFornecedor,
    documentoFornecedor,
    formaPagamento,
    dataInicio,
    dataFim,
    dataVencimentoInicio,
    dataVencimentoFim,
    dataPagamentoInicio,
    dataPagamentoFim,
    onMesChange,
    onAnoChange,
    onStatusChange,
    onNomeFornecedorChange,
    onDocumentoFornecedorChange,
    onFormaPagamentoChange,
    onDataInicioChange,
    onDataFimChange,
    onDataVencimentoInicioChange,
    onDataVencimentoFimChange,
    onDataPagamentoInicioChange,
    onDataPagamentoFimChange,
    onSearch,
    onClearFilters,
}: InvoicesFiltersProps) {
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
                        Status
                    </label>
                    <select
                        value={status}
                        onChange={(e) => onStatusChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                        <option value="">Todos os status</option>
                        <option value="agendado">Agendado</option>
                        <option value="pago">Pago</option>
                        <option value="pendente">Pendente</option>
                        <option value="aguardando boleto">Aguardando Boleto</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nome do Fornecedor
                    </label>
                    <Input
                        type="text"
                        value={nomeFornecedor}
                        onChange={(e) => onNomeFornecedorChange(e.target.value)}
                        placeholder="Buscar por fornecedor"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Documento do Fornecedor
                    </label>
                    <Input
                        type="text"
                        value={documentoFornecedor}
                        onChange={(e) => onDocumentoFornecedorChange(maskCpfCnpj(e.target.value))}
                        placeholder="CPF/CNPJ"
                        maxLength={18}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Forma de Pagamento
                    </label>
                    <select
                        value={formaPagamento}
                        onChange={(e) => onFormaPagamentoChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                        <option value="">Todas as formas</option>
                        <option value="Boleto">Boleto</option>
                        <option value="PIX">PIX</option>
                        <option value="DDA">DDA</option>
                        <option value="Débito">Débito</option>
                        <option value="Automático">Automático</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Data Início
                    </label>
                    <Input
                        type="date"
                        value={dataInicio}
                        onChange={(e) => onDataInicioChange(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Data Fim
                    </label>
                    <Input
                        type="date"
                        value={dataFim}
                        onChange={(e) => onDataFimChange(e.target.value)}
                    />
                </div>

                {/* <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Vencimento Início
                    </label>
                    <Input
                        type="date"
                        value={dataVencimentoInicio}
                        onChange={(e) => onDataVencimentoInicioChange(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Vencimento Fim
                    </label>
                    <Input
                        type="date"
                        value={dataVencimentoFim}
                        onChange={(e) => onDataVencimentoFimChange(e.target.value)}
                    />
                </div> */}

                {/* <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pagamento Início
                    </label>
                    <Input
                        type="date"
                        value={dataPagamentoInicio}
                        onChange={(e) => onDataPagamentoInicioChange(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pagamento Fim
                    </label>
                    <Input
                        type="date"
                        value={dataPagamentoFim}
                        onChange={(e) => onDataPagamentoFimChange(e.target.value)}
                    />
                </div> */}
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
