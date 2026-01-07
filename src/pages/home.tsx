import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';
import { Card, CardContent, CardHeader } from '../components/Card';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useEffect } from 'react';
import { ThumbsUp, BadgeCheck, User, Lock } from 'lucide-react';

export default function Home() {
    const { user, isAuthenticated, loading, isAdmin } = useAuth();
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

    if (!isAuthenticated) {
        return null;
    }

    return (
        <>
            <Head>
                <title>Home - Casa Alves</title>
            </Head>

            {/* Main Content */}
            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Card */}
                <Card className="mb-8">
                    <CardContent className="py-8">
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                                <ThumbsUp className="w-10 h-10 text-green-600" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                Olá, {user?.name}!
                            </h2>
                            <p className="text-gray-600 mb-6">
                                Você está logado como {isAdmin ? 'administrador' : 'usuário comum'}
                            </p>
                            {isAdmin && (
                                <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                    <BadgeCheck className="w-4 h-4 mr-2" />
                                    Acesso total ao sistema
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader>
                            <h3 className="text-lg font-semibold text-gray-900">Dados da Conta</h3>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <p className="text-sm text-gray-500">Nome</p>
                                <p className="text-base font-medium text-gray-900">{user?.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Login</p>
                                <p className="text-base font-medium text-gray-900">{user?.login}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">ID do Usuário</p>
                                <p className="text-base font-medium text-gray-900">#{user?.id}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <h3 className="text-lg font-semibold text-gray-900">Nível de Acesso</h3>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <p className="text-sm text-gray-500">Nível Atual</p>
                                <p className="text-2xl font-bold text-green-600">{user?.accessLevel}</p>
                            </div>
                            <div className="pt-2">
                                <div className="flex items-center space-x-2">
                                    <div className={`h-2 w-2 rounded-full ${isAdmin ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                                    <span className="text-sm text-gray-600">
                                        {isAdmin ? 'Privilégios Administrativos' : 'Usuário Padrão'}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="md:col-span-2 lg:col-span-1">
                        <CardHeader>
                            <h3 className="text-lg font-semibold text-gray-900">Ações Rápidas</h3>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button variant="secondary" className="w-full justify-start">
                                <User className="w-5 h-5 mr-2" />
                                Editar Perfil
                            </Button>
                            <Button variant="secondary" className="w-full justify-start">
                                <Lock className="w-5 h-5 mr-2" />
                                Alterar Senha
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}