import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Home, Menu, X, User, Lock, LogOut } from 'lucide-react';

export function Navbar() {
    const { user, logout, isAdmin } = useAuth();
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const navigation = [
        { name: 'Home', href: '/home' },
        { name: 'Vendas', href: '/vendas' },
        { name: 'Despesas', href: '/despesas' },
        ...(isAdmin ? [{ name: 'Usuários', href: '/usuarios' }, { name: 'Logs', href: '/logs' }] : []),
    ];

    const isActive = (path: string) => router.pathname === path;

    return (
        <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-4">
                        <Link href="/home" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                            <div className="flex items-center justify-center w-10 h-10 bg-green-600 rounded-lg">
                                <Home className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold text-gray-900 hidden sm:block">Casa Alves</span>
                        </Link>

                        <div className="hidden md:flex items-center space-x-1 ml-6">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                        isActive(item.href) ? 'bg-green-50 text-green-700' : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="hidden md:flex items-center space-x-3">
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                                <p className="text-xs text-gray-500">{isAdmin ? 'Administrador' : 'Usuário'}</p>
                            </div>
                            
                            <div className="relative">
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center justify-center w-10 h-10 bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors font-semibold"
                                >
                                    {user?.name.charAt(0).toUpperCase()}
                                </button>

                                {isProfileOpen && (
                                    <>
                                        <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)} />
                                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                                            <div className="px-4 py-3 border-b border-gray-100">
                                                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                                                <p className="text-xs text-gray-500">{user?.login}</p>
                                            </div>
                                            
                                            <Link
                                                href="/perfil"
                                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                                onClick={() => setIsProfileOpen(false)}
                                            >
                                                <User className="w-4 h-4 mr-3" />
                                                Meu Perfil
                                            </Link>

                                            <Link
                                                href="/alterar-senha"
                                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                                onClick={() => setIsProfileOpen(false)}
                                            >
                                                <Lock className="w-4 h-4 mr-3" />
                                                Alterar Senha
                                            </Link>

                                            <div className="border-t border-gray-100 my-1" />

                                            <button
                                                onClick={() => {
                                                    setIsProfileOpen(false);
                                                    logout();
                                                }}
                                                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                            >
                                                <LogOut className="w-4 h-4 mr-3" />
                                                Sair
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100">
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {isMenuOpen && (
                    <div className="md:hidden border-t border-gray-200 py-3">
                        <div className="flex items-center space-x-3 px-4 py-3 bg-gray-50 rounded-lg mb-3">
                            <div className="flex items-center justify-center w-10 h-10 bg-green-100 text-green-700 rounded-full font-semibold">
                                {user?.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                                <p className="text-xs text-gray-500">{user?.login}</p>
                            </div>
                        </div>

                        <div className="space-y-1">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`block px-4 py-2 rounded-lg text-sm font-medium ${
                                        isActive(item.href) ? 'bg-green-50 text-green-700' : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            ))}

                            <div className="border-t border-gray-200 my-2" />

                            <Link href="/perfil" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg" onClick={() => setIsMenuOpen(false)}>
                                <User className="w-4 h-4 mr-3" />
                                Meu Perfil
                            </Link>

                            <Link href="/alterar-senha" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg" onClick={() => setIsMenuOpen(false)}>
                                <Lock className="w-4 h-4 mr-3" />
                                Alterar Senha
                            </Link>

                            <button onClick={() => { setIsMenuOpen(false); logout(); }} className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg">
                                <LogOut className="w-4 h-4 mr-3" />
                                Sair
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
