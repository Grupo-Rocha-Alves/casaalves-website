import { Search } from 'lucide-react';
import { Button } from './Button';

interface UsersFiltersProps {
    searchNome: string;
    filterNivelAcesso: number | undefined;
    onSearchChange: (value: string) => void;
    onFilterChange: (value: number | undefined) => void;
    onSearch: () => void;
}

export function UsersFilters({
    searchNome,
    filterNivelAcesso,
    onSearchChange,
    onFilterChange,
    onSearch,
}: UsersFiltersProps) {
    return (
        <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar por nome..."
                        value={searchNome}
                        onChange={(e) => onSearchChange(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && onSearch()}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                </div>
            </div>
            <div className="w-full md:w-48">
                <select
                    value={filterNivelAcesso || ''}
                    onChange={(e) => onFilterChange(e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                    <option value="">Todos os níveis</option>
                    <option value="1">Usuário</option>
                    <option value="2">Administrador</option>
                    <option value="3">Super Admin</option>
                </select>
            </div>
            <Button onClick={onSearch} variant="secondary">
                <Search className="w-4 h-4 mr-2" />
                Buscar
            </Button>
        </div>
    );
}
