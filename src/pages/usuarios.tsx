import { useState, useEffect, FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import { Button } from '../components/Button';
import { Card, CardContent, CardHeader } from '../components/Card';
import Head from 'next/head';
import { useQueryGetAllUsers } from '../hooks/useQueryGetAllUsers';
import { useMutateUpdateUser } from '../hooks/mutations/useMutateUpdateUser';
import { useMutateCreateUser } from '../hooks/mutations/useMutateCreateUser';
import { useMutateDeleteUser } from '../hooks/mutations/useMutateDeleteUser';
import { UsersFilters } from '../components/UsersFilters';
import { UsersTable } from '../components/UsersTable';
import { Pagination } from '../components/Pagination';
import { UserModal } from '../components/UserModal';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import { Users, Plus } from 'lucide-react';

interface UserFormData {
    nome: string;
    login: string;
    senha: string;
    nivelAcesso: number;
}

interface UserModalData extends UserFormData {
    idUsuario?: number;
}

export default function Usuarios() {
    const { user, isAuthenticated, loading, isAdmin } = useAuth();
    const router = useRouter();
    const { users, pagination, loading: loadingUsers, getAllUsers } = useQueryGetAllUsers();
    const { updateUser, loading: updating } = useMutateUpdateUser();
    const { createUser, loading: creating } = useMutateCreateUser();
    const { deleteUser, loading: deleting } = useMutateDeleteUser();

    // Estados de UI
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [currentUser, setCurrentUser] = useState<UserModalData | null>(null);
    
    // Estados do modal de confirmação de exclusão
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<{ idUsuario: number; nome: string } | null>(null);

    // Estados de filtros
    const [searchNome, setSearchNome] = useState('');
    const [filterNivelAcesso, setFilterNivelAcesso] = useState<number | undefined>();
    const [currentPage, setCurrentPage] = useState(1);

    // Estados de formulário
    const [formData, setFormData] = useState<UserFormData>({
        nome: '',
        login: '',
        senha: '',
        nivelAcesso: 1,
    });
    const [errors, setErrors] = useState<Partial<UserFormData>>({});

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push('/login');
        } else if (!loading && !isAdmin) {
            router.push('/home');
        }
    }, [isAuthenticated, loading, isAdmin, router]);

    useEffect(() => {
        if (isAuthenticated && isAdmin) {
            loadUsers();
        }
    }, [isAuthenticated, isAdmin, currentPage]);

    const loadUsers = async () => {
        try {
            await getAllUsers({
                page: currentPage,
                limit: 10,
                nome: searchNome || undefined,
                nivelAcesso: filterNivelAcesso,
            });
        } catch (error) {
            // Erro já tratado no hook
        }
    };

    const handleSearch = () => {
        setCurrentPage(1);
        loadUsers();
    };

    const handleOpenCreateModal = () => {
        setModalMode('create');
        setFormData({
            nome: '',
            login: '',
            senha: '',
            nivelAcesso: 1,
        });
        setCurrentUser(null);
        setErrors({});
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (usuario: any) => {
        setModalMode('edit');
        setFormData({
            nome: usuario.nome,
            login: usuario.login,
            senha: '',
            nivelAcesso: usuario.nivelAcesso,
        });
        setCurrentUser({ ...usuario, senha: '' });
        setErrors({});
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentUser(null);
        setFormData({
            nome: '',
            login: '',
            senha: '',
            nivelAcesso: 1,
        });
        setErrors({});
    };

    const handleOpenDeleteModal = (usuario: any) => {
        setUserToDelete({
            idUsuario: usuario.idUsuario,
            nome: usuario.nome,
        });
        setIsDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setUserToDelete(null);
    };

    const handleConfirmDelete = async () => {
        if (!userToDelete) return;

        try {
            await deleteUser(userToDelete.idUsuario);
            handleCloseDeleteModal();
            loadUsers();
        } catch (error) {
            // Erro já tratado no hook
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<UserFormData> = {};

        if (!formData.nome.trim()) {
            newErrors.nome = 'Nome é obrigatório';
        } else if (formData.nome.trim().length < 3) {
            newErrors.nome = 'Nome deve ter no mínimo 3 caracteres';
        }

        if (!formData.login.trim()) {
            newErrors.login = 'Login é obrigatório';
        } else if (formData.login.trim().length < 3) {
            newErrors.login = 'Login deve ter no mínimo 3 caracteres';
        }

        // Senha obrigatória apenas na criação
        if (modalMode === 'create') {
            if (!formData.senha) {
                newErrors.senha = 'Senha é obrigatória';
            } else if (formData.senha.length < 4) {
                newErrors.senha = 'Senha deve ter no mínimo 4 caracteres';
            }
        } else if (formData.senha && formData.senha.length < 4) {
            newErrors.senha = 'Senha deve ter no mínimo 4 caracteres';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            if (modalMode === 'create') {
                await createUser({
                    nome: formData.nome.trim(),
                    login: formData.login.trim(),
                    senha: formData.senha,
                    nivelAcesso: formData.nivelAcesso,
                });
            } else if (currentUser?.idUsuario) {
                const updateData: any = {
                    nome: formData.nome.trim(),
                    login: formData.login.trim(),
                    nivelAcesso: formData.nivelAcesso,
                };

                if (formData.senha) {
                    updateData.senha = formData.senha;
                }

                await updateUser(currentUser.idUsuario, updateData);
            }

            handleCloseModal();
            loadUsers();
        } catch (error) {
            // Erro já tratado
        }
    };

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

    if (!isAuthenticated || !isAdmin) {
        return null;
    }

    return (
        <>
            <Head>
                <title>Gerenciar Usuários - Casa Alves</title>
            </Head>

            <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-6 sm:mb-8">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex items-center space-x-3">
                                <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex-shrink-0">
                                    <Users className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                                </div>
                                <div className="min-w-0">
                                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Gerenciar Usuários</h1>
                                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                                        Visualize, crie e edite usuários do sistema
                                    </p>
                                </div>
                            </div>
                            <Button 
                                onClick={handleOpenCreateModal}
                                className="w-full sm:w-auto"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Novo Usuário
                            </Button>
                        </div>
                    </div>

                    {/* Filtros */}
                    <Card className="mb-6">
                        <CardContent className="py-4">
                            <UsersFilters
                                searchNome={searchNome}
                                filterNivelAcesso={filterNivelAcesso}
                                onSearchChange={setSearchNome}
                                onFilterChange={setFilterNivelAcesso}
                                onSearch={handleSearch}
                            />
                        </CardContent>
                    </Card>

                    {/* Tabela de Usuários */}
                    <Card>
                        <CardContent className="p-0">
                            <UsersTable
                                users={users}
                                loading={loadingUsers}
                                onEdit={handleOpenEditModal}
                                onDelete={handleOpenDeleteModal}
                            />
                            <Pagination
                                currentPage={currentPage}
                                totalPages={pagination.totalPages}
                                totalItems={pagination.total}
                                itemsPerPage={pagination.limit}
                                onPageChange={setCurrentPage}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>

            <UserModal
                isOpen={isModalOpen}
                mode={modalMode}
                formData={formData}
                errors={errors}
                loading={updating || creating}
                onClose={handleCloseModal}
                onSubmit={handleSubmit}
                onFormChange={(data) => setFormData({ ...formData, ...data })}
            />

            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                userName={userToDelete?.nome || ''}
                loading={deleting}
                onConfirm={handleConfirmDelete}
                onCancel={handleCloseDeleteModal}
            />
        </>
    );
}
