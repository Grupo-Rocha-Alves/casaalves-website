import { Shield, Edit, Loader2, Users as UsersIcon, Trash2 } from 'lucide-react';
import { Button } from './Button';
import { getAccessLevelLabel, getAccessLevelColor } from '../utils/accessLevel';

interface User {
    idUsuario: number;
    nome: string;
    login: string;
    nivelAcesso: number;
}

interface UsersTableProps {
    users: User[];
    loading: boolean;
    onEdit: (user: User) => void;
    onDelete: (user: User) => void;
}

export function UsersTable({ users, loading, onEdit, onDelete }: UsersTableProps) {

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
            </div>
        );
    }

    if (users.length === 0) {
        return (
            <div className="text-center py-12">
                <UsersIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Nenhum usuário encontrado</p>
            </div>
        );
    }

    return (
        <>
            {/* Layout Mobile - Cards */}
            <div className="md:hidden space-y-2.5 px-1 py-3">
                {users.map((usuario) => (
                    <div key={usuario.idUsuario} className="bg-white border border-gray-200 rounded-lg p-3 space-y-2.5">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="text-sm font-medium text-gray-900 mb-1">{usuario.nome}</div>
                                <div className="text-xs text-gray-500 mb-2">{usuario.login}</div>
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getAccessLevelColor(usuario.nivelAcesso)}`}>
                                    <Shield className="w-3 h-3 mr-1" />
                                    {getAccessLevelLabel(usuario.nivelAcesso)}
                                </span>
                            </div>
                            <span className="text-xs font-mono text-gray-500">#{usuario.idUsuario}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2 pt-2 border-t border-gray-100">
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => onEdit(usuario)}
                                className="flex-1"
                            >
                                <Edit className="w-4 h-4 mr-1" />
                                Editar
                            </Button>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => onDelete(usuario)}
                                className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                                <Trash2 className="w-4 h-4 mr-1" />
                                Excluir
                            </Button>
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
                                Nome
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Login
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Nível de Acesso
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Ações
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((usuario) => (
                            <tr key={usuario.idUsuario} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                                    #{usuario.idUsuario}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">
                                        {usuario.nome}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500">
                                        {usuario.login}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAccessLevelColor(usuario.nivelAcesso)}`}>
                                        <Shield className="w-3 h-3 mr-1" />
                                        {getAccessLevelLabel(usuario.nivelAcesso)}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex items-center justify-end space-x-2">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => onEdit(usuario)}
                                        >
                                            <Edit className="w-4 h-4 mr-1" />
                                            Editar
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => onDelete(usuario)}
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                        >
                                            <Trash2 className="w-4 h-4 mr-1" />
                                            Excluir
                                        </Button>
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
