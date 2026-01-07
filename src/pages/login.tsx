import { useState, FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card, CardContent, CardHeader } from '../components/Card';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Home } from 'lucide-react';

export default function Login() {
    const [login, setLogin] = useState('');
    const [senha, setSenha] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<{ login?: string; senha?: string }>({});
    
    const { login: authLogin, isAuthenticated } = useAuth();
    const router = useRouter();
    const currentYear = new Date().getFullYear();

    // Redirecionar se já estiver autenticado
    if (isAuthenticated) {
        router.push('/home');
        return null;
    }

    const validateForm = () => {
        const newErrors: { login?: string; senha?: string } = {};

        if (!login.trim()) {
            newErrors.login = 'Login é obrigatório';
        }

        if (!senha) {
            newErrors.senha = 'Senha é obrigatória';
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
            await authLogin({ login, password: senha });
        } catch (error) {
            // Erro já tratado no contexto com toast
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Head>
                <title>Login - Casa Alves</title>
            </Head>
            
            <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center px-4 py-8">
                <div className="w-full max-w-md">
                    {/* Logo/Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-4">
                            <Home className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Casa Alves</h1>
                        <p className="text-gray-600">Faça login para acessar o sistema</p>
                    </div>

                    {/* Card de Login */}
                    <Card>
                        <CardHeader>
                            <h2 className="text-xl font-semibold text-gray-900">Entrar na conta</h2>
                        </CardHeader>
                        
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <Input
                                    label="Login"
                                    type="text"
                                    placeholder="seu@email.com"
                                    value={login}
                                    onChange={(e) => {
                                        setLogin(e.target.value);
                                        if (errors.login) setErrors({ ...errors, login: undefined });
                                    }}
                                    error={errors.login}
                                    disabled={isLoading}
                                    autoComplete="username"
                                />

                                <Input
                                    label="Senha"
                                    type="password"
                                    placeholder="••••••••"
                                    value={senha}
                                    onChange={(e) => {
                                        setSenha(e.target.value);
                                        if (errors.senha) setErrors({ ...errors, senha: undefined });
                                    }}
                                    error={errors.senha}
                                    disabled={isLoading}
                                    autoComplete="current-password"
                                />

                                <Button
                                    type="submit"
                                    className="w-full"
                                    isLoading={isLoading}
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Entrando...' : 'Entrar'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Footer */}
                    <p className="text-center text-sm text-gray-600 mt-6">
                        © {currentYear} Grupo Rocha Alves. Todos os direitos reservados.
                    </p>
                    <p className="text-center text-sm text-gray-500 mt-2">
                        Desenvolvido por <a href="https://github.com/ianfelps" target="_blank" rel="noopener noreferrer">ianfelps</a>.
                    </p>
                </div>
            </div>
        </>
    );
}
