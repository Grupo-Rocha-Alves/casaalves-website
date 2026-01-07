import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';
import api from '../service/api';
import toast from 'react-hot-toast';

interface User {
    id: number;
    name: string;
    login: string;
    accessLevel: number;
}

interface LoginData {
    login: string;
    password: string;
}

interface RegisterData {
    name: string;
    login: string;
    password: string;
}

interface ApiUser {
    idUsuario: number;
    nome: string;
    login: string;
    nivelAcesso: number;
}

interface AuthResponse {
    success: boolean;
    message: string;
    data: {
        token: string;
        user: ApiUser;
    };
}

interface MeResponse {
    success: boolean;
    data: ApiUser;
}

interface AuthContextData {
    user: User | null;
    loading: boolean;
    login: (data: LoginData) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    isAdmin: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const loadUser = async () => {
            try {
                const token = localStorage.getItem('token');
                const userStr = localStorage.getItem('user');

                if (token && userStr) {
                    try {
                        const userData = JSON.parse(userStr);
                        setUser(userData);

                        try {
                            const response = await api.get<MeResponse>('/auth/me');
                            if (response.data.success) {
                                const apiUser = response.data.data;
                                const mappedUser: User = {
                                    id: apiUser.idUsuario,
                                    name: apiUser.nome,
                                    login: apiUser.login,
                                    accessLevel: apiUser.nivelAcesso,
                                };
                                setUser(mappedUser);
                                localStorage.setItem('user', JSON.stringify(mappedUser));
                            }
                        } catch (error) {
                            localStorage.removeItem('token');
                            localStorage.removeItem('user');
                            setUser(null);
                        }
                    } catch (parseError) {
                        console.error('Invalid user data in localStorage:', parseError);
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        setUser(null);
                    }
                }
            } catch (error) {
                console.error('Error loading user:', error);
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    const login = async ({ login, password }: LoginData) => {
        try {
            const response = await api.post<AuthResponse>('/auth/login', {
                login,
                senha: password,
            });

            const { token, user: apiUser } = response.data.data;
            
            const mappedUser: User = {
                id: apiUser.idUsuario,
                name: apiUser.nome,
                login: apiUser.login,
                accessLevel: apiUser.nivelAcesso,
            };

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(mappedUser));
            setUser(mappedUser);

            toast.success('Login realizado com sucesso!');
            router.push('/home');
        } catch (error: any) {
            let message = 'Erro ao fazer login';
            
            if (error.response?.status === 401) {
                message = 'Credenciais inválidas. Por favor, tente novamente.';
            } else if (error.response?.data?.message) {
                message = error.response.data.message;
            }
            
            toast.error(message);
            throw error;
        }
    };

    const register = async ({ name, login, password }: RegisterData) => {
        try {
            const response = await api.post('/auth/register', {
                nome: name,
                login,
                senha: password,
            });

            toast.success('Usuário cadastrado com sucesso!');
        } catch (error: any) {
            let message = 'Erro ao cadastrar';
            
            if (error.response?.status === 403) {
                message = 'Você não tem permissão para cadastrar usuários.';
            } else if (error.response?.data?.message) {
                message = error.response.data.message;
            }
            
            toast.error(message);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        toast.success('Logout realizado com sucesso!');
        router.push('/login');
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                register,
                logout,
                isAuthenticated: !!user,
                isAdmin: user?.accessLevel === 3,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
