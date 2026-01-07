import { Clock, User, FileText, Loader2, ScrollText } from 'lucide-react';

interface Log {
    idLog: number;
    idUsuario: number;
    nomeUsuario: string;
    acao: string;
    dataHora: string;
}

interface LogsTableProps {
    logs: Log[];
    loading: boolean;
}

export function LogsTable({ logs, loading }: LogsTableProps) {
    const formatDateTime = (dateTime: string) => {
        return new Date(dateTime).toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    };

    const getActionColor = (acao: string) => {
        const acaoLower = acao.toLowerCase();
        if (acaoLower.includes('login')) return 'bg-blue-100 text-blue-700';
        if (acaoLower.includes('cadastro')) return 'bg-green-100 text-green-700';
        if (acaoLower.includes('atualização') || acaoLower.includes('atualizacao')) return 'bg-orange-100 text-orange-700';
        if (acaoLower.includes('exclusão') || acaoLower.includes('exclusao')) return 'bg-red-100 text-red-700';
        if (acaoLower.includes('senha')) return 'bg-purple-100 text-purple-700';
        return 'bg-gray-100 text-gray-700';
    };

    const getActionIcon = (acao: string) => {
        const acaoLower = acao.toLowerCase();
        if (acaoLower.includes('login')) return '🔐';
        if (acaoLower.includes('cadastro')) return '➕';
        if (acaoLower.includes('atualização') || acaoLower.includes('atualizacao')) return '✏️';
        if (acaoLower.includes('exclusão') || acaoLower.includes('exclusao')) return '🗑️';
        if (acaoLower.includes('senha')) return '🔑';
        return '📋';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
            </div>
        );
    }

    if (logs.length === 0) {
        return (
            <div className="text-center py-12">
                <ScrollText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Nenhum log encontrado</p>
            </div>
        );
    }

    return (
        <>
            {/* Layout Mobile - Cards */}
            <div className="md:hidden space-y-2.5 px-1 py-3">
                {logs.map((log) => (
                    <div key={log.idLog} className="bg-white border border-gray-200 rounded-lg p-3 space-y-2.5">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-mono text-gray-500">#{log.idLog}</span>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getActionColor(log.acao)}`}>
                                <span className="mr-1">{getActionIcon(log.acao)}</span>
                                {log.acao}
                            </span>
                        </div>
                        
                        <div className="space-y-1.5">
                            <div className="flex items-start space-x-2">
                                <Clock className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                <div>
                                    <div className="text-xs text-gray-500">Data/Hora</div>
                                    <div className="text-sm text-gray-900">{formatDateTime(log.dataHora)}</div>
                                </div>
                            </div>
                            
                            <div className="flex items-start space-x-2">
                                <User className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                <div>
                                    <div className="text-xs text-gray-500">Usuário</div>
                                    <div className="text-sm font-medium text-gray-900">{log.nomeUsuario}</div>
                                    <div className="text-xs text-gray-500">ID: {log.idUsuario}</div>
                                </div>
                            </div>
                        </div>
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
                                Data/Hora
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Usuário
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Ação
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {logs.map((log) => (
                            <tr key={log.idLog} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                                    #{log.idLog}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center space-x-2">
                                        <Clock className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm text-gray-900">
                                            {formatDateTime(log.dataHora)}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center space-x-2">
                                        <User className="w-4 h-4 text-gray-400" />
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">
                                                {log.nomeUsuario}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                ID: {log.idUsuario}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-lg">{getActionIcon(log.acao)}</span>
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getActionColor(log.acao)}`}>
                                            {log.acao}
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}
