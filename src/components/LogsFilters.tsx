import { Calendar, Search, User } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';

interface UserOption {
    idUsuario: number;
    nome: string;
}

interface LogsFiltersProps {
    searchAcao: string;
    filterIdUsuario: string;
    dateStart: string;
    dateEnd: string;
    users: UserOption[];
    loadingUsers: boolean;
    onSearchChange: (value: string) => void;
    onUserFilterChange: (value: string) => void;
    onDateStartChange: (value: string) => void;
    onDateEndChange: (value: string) => void;
    onSearch: () => void;
    onClearFilters: () => void;
}

export function LogsFilters({
    searchAcao,
    filterIdUsuario,
    dateStart,
    dateEnd,
    users,
    loadingUsers,
    onSearchChange,
    onUserFilterChange,
    onDateStartChange,
    onDateEndChange,
    onSearch,
    onClearFilters,
}: LogsFiltersProps) {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar por ação..."
                        value={searchAcao}
                        onChange={(e) => onSearchChange(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && onSearch()}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                </div>

                <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
                    <select
                        value={filterIdUsuario}
                        onChange={(e) => onUserFilterChange(e.target.value)}
                        disabled={loadingUsers}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <option value="">Todos os usuários</option>
                        {users.map((user) => (
                            <option key={user.idUsuario} value={user.idUsuario}>
                                {user.nome} (ID: {user.idUsuario})
                            </option>
                        ))}
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Data Inicial
                    </label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="date"
                            value={dateStart}
                            onChange={(e) => onDateStartChange(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Data Final
                    </label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="date"
                            value={dateEnd}
                            onChange={(e) => onDateEndChange(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                    </div>
                </div>

                <div className="flex items-end">
                    <Button onClick={onSearch} className="w-full">
                        <Search className="w-4 h-4 mr-2" />
                        Buscar
                    </Button>
                </div>

                <div className="flex items-end">
                    <Button onClick={onClearFilters} variant="secondary" className="w-full">
                        Limpar Filtros
                    </Button>
                </div>
            </div>
        </div>
    );
}
