import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import { Button } from '../components/Button';
import { Card, CardContent, CardHeader } from '../components/Card';
import Head from 'next/head';
import { ChevronLeft, User, Shield, Lock } from 'lucide-react';
import Link from 'next/link';
import { getAccessLevelLabel } from '../utils/accessLevel';

export default function Perfil() {
    const { user, isAuthenticated, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Carregando...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated || !user) {
        return null;
    }

    const accessLevelLabel = (level: number) => {
        switch (level) {
            case 1:
                return 'Usuário';
            case 2:
                return 'Gerente';
            case 3:
                return 'Administrador';
            default:
                return 'Desconhecido';
        }
    };

    return (
        <>
            <Head>
                <title>Meu Perfil - Casa Alves</title>
            </Head>

            <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl mx-auto">
                    <div className="mb-4 sm:mb-6">
                        <button
                            onClick={() => router.back()}
                            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors text-sm sm:text-base"
                        >
                            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-1" />
                            Voltar
                        </button>
                    </div>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex-shrink-0">
                                        <User className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                                    </div>
                                    <div className="min-w-0">
                                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Meu Perfil</h1>
                                        <p className="text-xs sm:text-sm text-gray-500 mt-1">
                                            Gerencie suas informações pessoais
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent>
                            <div className="space-y-6">
                                {/* Informações do Usuário */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            Nome
                                        </label>
                                        <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                                            <span className="text-gray-900">
                                                {user.name}
                                            </span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            Login
                                        </label>
                                        <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                                            <span className="text-gray-900">
                                                {user.login}
                                            </span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            Nível de Acesso
                                        </label>
                                        <div className="flex items-center space-x-2 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                                            <Shield className="w-5 h-5 text-gray-500" />
                                            <span className="text-gray-900 font-medium">
                                                {getAccessLevelLabel(user.accessLevel)}
                                            </span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            ID do Usuário
                                        </label>
                                        <div className="flex items-center space-x-2 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                                            <span className="text-gray-600 font-mono">
                                                #{user.id}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Ações */}
                                <div className="pt-4 border-t border-gray-200">
                                    <Link href="/alterar-senha" className="block">
                                        <Button
                                            type="button"
                                            className="w-full"
                                        >
                                            <Lock className="w-4 h-4 mr-2" />
                                            Alterar Senha
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
