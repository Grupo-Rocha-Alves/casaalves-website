import { useState, FormEvent, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card, CardContent, CardHeader } from '../components/Card';
import Head from 'next/head';
import api from '../service/api';
import toast from 'react-hot-toast';
import { ChevronLeft, Lock, Info } from 'lucide-react';

export default function AlterarSenha() {
    const [senhaAtual, setSenhaAtual] = useState('');
    const [novaSenha, setNovaSenha] = useState('');
    const [confirmarNovaSenha, setConfirmarNovaSenha] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<{ senhaAtual?: string; novaSenha?: string; confirmarNovaSenha?: string }>({});
    
    const { isAuthenticated, loading } = useAuth();
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

    const validateForm = () => {
        const newErrors: { senhaAtual?: string; novaSenha?: string; confirmarNovaSenha?: string } = {};

        if (!senhaAtual) {
            newErrors.senhaAtual = 'Senha atual é obrigatória';
        }

        if (!novaSenha) {
            newErrors.novaSenha = 'Nova senha é obrigatória';
        } else if (novaSenha.length < 4) {
            newErrors.novaSenha = 'Nova senha deve ter no mínimo 4 caracteres';
        }

        if (!confirmarNovaSenha) {
            newErrors.confirmarNovaSenha = 'Confirmação de senha é obrigatória';
        } else if (novaSenha !== confirmarNovaSenha) {
            newErrors.confirmarNovaSenha = 'As senhas não coincidem';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        
        try {
            await api.post('/auth/changePassword', {
                senhaAtual,
                novaSenha,
                confirmarNovaSenha,
            });

            toast.success('Senha alterada com sucesso!');
            
            // Limpar campos
            setSenhaAtual('');
            setNovaSenha('');
            setConfirmarNovaSenha('');
            
            // Redirecionar após 2 segundos
            setTimeout(() => {
                router.push('/home');
            }, 2000);
        } catch (error: any) {
            let message = 'Erro ao alterar senha';
            
            if (error.response?.status === 401) {
                message = 'Senha atual incorreta';
            } else if (error.response?.data?.message) {
                message = error.response.data.message;
            }
            
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Head>
                <title>Alterar Senha - Casa Alves</title>
            </Head>
            
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-8">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-4"
                    >
                        <ChevronLeft className="w-5 h-5 mr-2" />
                        Voltar
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Alterar Senha</h1>
                    <p className="text-gray-600">Atualize sua senha para manter sua conta segura</p>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex items-center space-x-3">
                            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg">
                                <Lock className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">Segurança da Conta</h2>
                                <p className="text-sm text-gray-500">Mantenha sua senha sempre atualizada</p>
                            </div>
                        </div>
                    </CardHeader>
                    
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <Input
                                label="Senha Atual"
                                type="password"
                                placeholder="Digite sua senha atual"
                                value={senhaAtual}
                                onChange={(e) => {
                                    setSenhaAtual(e.target.value);
                                    if (errors.senhaAtual) setErrors({ ...errors, senhaAtual: undefined });
                                }}
                                error={errors.senhaAtual}
                                disabled={isLoading}
                                autoComplete="current-password"
                            />

                            <div className="border-t border-gray-200 pt-6">
                                <Input
                                    label="Nova Senha"
                                    type="password"
                                    placeholder="Digite sua nova senha"
                                    value={novaSenha}
                                    onChange={(e) => {
                                        setNovaSenha(e.target.value);
                                        if (errors.novaSenha) setErrors({ ...errors, novaSenha: undefined });
                                    }}
                                    error={errors.novaSenha}
                                    disabled={isLoading}
                                    autoComplete="new-password"
                                />

                                <div className="mt-6">
                                    <Input
                                        label="Confirmar Nova Senha"
                                        type="password"
                                        placeholder="Confirme sua nova senha"
                                        value={confirmarNovaSenha}
                                        onChange={(e) => {
                                            setConfirmarNovaSenha(e.target.value);
                                            if (errors.confirmarNovaSenha) setErrors({ ...errors, confirmarNovaSenha: undefined });
                                        }}
                                        error={errors.confirmarNovaSenha}
                                        disabled={isLoading}
                                        autoComplete="new-password"
                                    />
                                </div>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex items-start">
                                    <Info className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                                    <div className="text-sm text-blue-800">
                                        <p className="font-medium mb-1">Dicas de segurança:</p>
                                        <ul className="list-disc list-inside space-y-1">
                                            <li>Use no mínimo 4 caracteres</li>
                                            <li>Combine letras e números</li>
                                            <li>Evite senhas óbvias ou fáceis de adivinhar</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-end space-x-4 pt-4">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => router.back()}
                                    disabled={isLoading}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    isLoading={isLoading}
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Alterando...' : 'Alterar Senha'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
