// src/components/admin/user-management.tsx
'use client';
import React, { useState, useEffect } from 'react';
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
    Input,
    Button,
    Badge,
    Select,
    Dialog,
    DialogHeader,
    DialogTitle,
    DialogContent,
    DialogFooter
} from '@/components/ui';
import { ApiService } from '@/lib/api';
import { formatCurrency, formatDateTime, cn } from '@/lib/utils';
import { useToast } from '@/hooks/useToast';

interface AdminUser {
    id: string;
    name: string;
    email: string;
    dni: string;
    phone: string;
    role: 'user' | 'trader' | 'admin';
    usdBalance: number;
    penBalance: number;
    profitPercentage: number;
    rankingPosition: number;
    completedOperations: number;
    registrationDate: string;
    lastLogin?: string;
    isActive: boolean;
}

interface UserManagementProps {
    className?: string;
}

export const UserManagement: React.FC<UserManagementProps> = ({ className }) => {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [sortBy, setSortBy] = useState<keyof AdminUser>('registrationDate');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
    const [showUserDetails, setShowUserDetails] = useState(false);
    const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
    const [showEditDialog, setShowEditDialog] = useState(false);

    const { showSuccess, showError } = useToast();

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        filterAndSortUsers();
    }, [users, searchTerm, roleFilter, sortBy, sortOrder]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await ApiService.getAllUsers();

            if (response.success) {
                setUsers(response.data.users);
            }
        } catch (error) {
            showError('Error al cargar usuarios', error instanceof Error ? error.message : 'Error desconocido');
        } finally {
            setLoading(false);
        }
    };

    const filterAndSortUsers = () => {
        let filtered = [...users];

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(user =>
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.dni.includes(searchTerm)
            );
        }

        // Apply role filter
        if (roleFilter !== 'all') {
            filtered = filtered.filter(user => user.role === roleFilter);
        }

        // Apply sorting
        filtered.sort((a, b) => {
            let aValue = a[sortBy];
            let bValue = b[sortBy];

            // Handle different data types
            if (typeof aValue === 'string' && typeof bValue === 'string') {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            }

            if (sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

        setFilteredUsers(filtered);
    };

    const handleUserAction = async (userId: string, action: 'activate' | 'deactivate' | 'reset') => {
        try {
            let response;

            switch (action) {
                case 'activate':
                    response = await ApiService.updateUserStatus(userId, { isActive: true });
                    break;
                case 'deactivate':
                    response = await ApiService.updateUserStatus(userId, { isActive: false });
                    break;
                case 'reset':
                    response = await ApiService.resetUserBalance(userId);
                    break;
            }

            if (response?.success) {
                showSuccess('Acción completada', 'El usuario ha sido actualizado exitosamente');
                fetchUsers(); // Refresh the list
            }
        } catch (error) {
            showError('Error en la acción', error instanceof Error ? error.message : 'Error desconocido');
        }
    };

    const handleEditUser = async (userData: Partial<AdminUser>) => {
        if (!editingUser) return;

        try {
            const response = await ApiService.updateUser(editingUser.id, userData);

            if (response.success) {
                showSuccess('Usuario actualizado', 'Los cambios han sido guardados exitosamente');
                setShowEditDialog(false);
                setEditingUser(null);
                fetchUsers();
            }
        } catch (error) {
            showError('Error al actualizar', error instanceof Error ? error.message : 'Error desconocido');
        }
    };

    const getRoleBadgeVariant = (role: string) => {
        switch (role) {
            case 'admin': return 'destructive';
            case 'trader': return 'warning';
            default: return 'secondary';
        }
    };

    const getRoleLabel = (role: string) => {
        switch (role) {
            case 'admin': return 'Administrador';
            case 'trader': return 'Trader';
            default: return 'Usuario';
        }
    };

    if (loading) {
        return (
            <div className={cn("space-y-4", className)}>
                <div className="animate-pulse">
                    <div className="h-4 bg-muted rounded w-1/4 mb-4"></div>
                    <div className="space-y-2">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-16 bg-muted rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={cn("space-y-6", className)}>
            {/* Header and Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold">{users.length}</p>
                        <p className="text-sm text-muted-foreground">Total Usuarios</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-trade-green">
                            {users.filter(u => u.role === 'user').length}
                        </p>
                        <p className="text-sm text-muted-foreground">Participantes</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-yellow-500">
                            {users.filter(u => u.role === 'trader').length}
                        </p>
                        <p className="text-sm text-muted-foreground">Traders</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-destructive">
                            {users.filter(u => u.role === 'admin').length}
                        </p>
                        <p className="text-sm text-muted-foreground">Admins</p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters and Search */}
            <Card>
                <CardHeader>
                    <CardTitle>Filtros y Búsqueda</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Input
                            placeholder="Buscar por nombre, email o DNI..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            leftIcon={
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            }
                        />

                        <Select
                            value={roleFilter}
                            onChange={setRoleFilter}
                            options={[
                                { value: 'all', label: 'Todos los roles' },
                                { value: 'user', label: 'Usuarios' },
                                { value: 'trader', label: 'Traders' },
                                { value: 'admin', label: 'Administradores' }
                            ]}
                        />

                        <Select
                            value={`${sortBy}-${sortOrder}`}
                            onChange={(value) => {
                                const [field, order] = value.split('-');
                                setSortBy(field as keyof AdminUser);
                                setSortOrder(order as 'asc' | 'desc');
                            }}
                            options={[
                                { value: 'registrationDate-desc', label: 'Registro (Reciente)' },
                                { value: 'registrationDate-asc', label: 'Registro (Antiguo)' },
                                { value: 'name-asc', label: 'Nombre (A-Z)' },
                                { value: 'name-desc', label: 'Nombre (Z-A)' },
                                { value: 'profitPercentage-desc', label: 'Ganancia (Mayor)' },
                                { value: 'profitPercentage-asc', label: 'Ganancia (Menor)' },
                                { value: 'completedOperations-desc', label: 'Operaciones (Más)' },
                                { value: 'completedOperations-asc', label: 'Operaciones (Menos)' }
                            ]}
                        />

                        <Button variant="secondary" onClick={() => {
                            setSearchTerm('');
                            setRoleFilter('all');
                            setSortBy('registrationDate');
                            setSortOrder('desc');
                        }}>
                            Limpiar Filtros
                        </Button>
                    </div>

                    {searchTerm && (
                        <p className="text-sm text-muted-foreground mt-2">
                            Mostrando {filteredUsers.length} de {users.length} usuarios
                        </p>
                    )}
                </CardContent>
            </Card>

            {/* Users Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Lista de Usuarios</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Usuario</TableHead>
                                    <TableHead>Contacto</TableHead>
                                    <TableHead>Saldos</TableHead>
                                    <TableHead>Rendimiento</TableHead>
                                    <TableHead>Rol</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead>Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUsers.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">{user.name}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    ID: {user.id.slice(-8)}
                                                </p>
                                            </div>
                                        </TableCell>

                                        <TableCell>
                                            <div className="space-y-1">
                                                <p className="text-sm">{user.email}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    DNI: {user.dni}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {user.phone}
                                                </p>
                                            </div>
                                        </TableCell>

                                        <TableCell>
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium text-trade-green">
                                                    {formatCurrency(user.usdBalance, 'USD')}
                                                </p>
                                                <p className="text-sm font-medium text-primary">
                                                    {formatCurrency(user.penBalance, 'PEN')}
                                                </p>
                                            </div>
                                        </TableCell>

                                        <TableCell>
                                            <div className="space-y-1">
                                                <Badge
                                                    variant={user.profitPercentage >= 0 ? 'success' : 'destructive'}
                                                    size="sm"
                                                >
                                                    {user.profitPercentage >= 0 ? '+' : ''}
                                                    {user.profitPercentage.toFixed(2)}%
                                                </Badge>
                                                <p className="text-sm text-muted-foreground">
                                                    Pos. #{user.rankingPosition} • {user.completedOperations} ops
                                                </p>
                                            </div>
                                        </TableCell>

                                        <TableCell>
                                            <Badge variant={getRoleBadgeVariant(user.role)} size="sm">
                                                {getRoleLabel(user.role)}
                                            </Badge>
                                        </TableCell>

                                        <TableCell>
                                            <Badge variant={user.isActive ? 'success' : 'secondary'} size="sm">
                                                {user.isActive ? 'Activo' : 'Inactivo'}
                                            </Badge>
                                        </TableCell>

                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="secondary"
                                                    onClick={() => {
                                                        setSelectedUser(user);
                                                        setShowUserDetails(true);
                                                    }}
                                                >
                                                    Ver
                                                </Button>

                                                <Button
                                                    size="sm"
                                                    variant="secondary"
                                                    onClick={() => {
                                                        setEditingUser(user);
                                                        setShowEditDialog(true);
                                                    }}
                                                >
                                                    Editar
                                                </Button>

                                                {user.role === 'user' && (
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() => handleUserAction(user.id, 'reset')}
                                                    >
                                                        Reset
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {filteredUsers.length === 0 && !loading && (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">
                                {searchTerm || roleFilter !== 'all'
                                    ? 'No se encontraron usuarios que coincidan con los filtros'
                                    : 'No hay usuarios registrados'
                                }
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* User Details Dialog */}
            <Dialog isOpen={showUserDetails} onClose={() => setShowUserDetails(false)}>
                <DialogHeader>
                    <DialogTitle>Detalles del Usuario</DialogTitle>
                </DialogHeader>
                <DialogContent>
                    {selectedUser && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium">Nombre</label>
                                    <p className="text-sm">{selectedUser.name}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Email</label>
                                    <p className="text-sm">{selectedUser.email}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium">DNI</label>
                                    <p className="text-sm">{selectedUser.dni}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Teléfono</label>
                                    <p className="text-sm">{selectedUser.phone}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Fecha de Registro</label>
                                    <p className="text-sm">{formatDateTime(selectedUser.registrationDate)}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Último Login</label>
                                    <p className="text-sm">
                                        {selectedUser.lastLogin
                                            ? formatDateTime(selectedUser.lastLogin)
                                            : 'Nunca'
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
                <DialogFooter>
                    <Button variant="secondary" onClick={() => setShowUserDetails(false)}>
                        Cerrar
                    </Button>
                </DialogFooter>
            </Dialog>

            {/* Edit User Dialog */}
            <Dialog isOpen={showEditDialog} onClose={() => setShowEditDialog(false)}>
                <DialogHeader>
                    <DialogTitle>Editar Usuario</DialogTitle>
                </DialogHeader>
                <DialogContent>
                    {editingUser && (
                        <div className="space-y-4">
                            <Input
                                label="Nombre"
                                value={editingUser.name}
                                onChange={(e) => setEditingUser({
                                    ...editingUser,
                                    name: e.target.value
                                })}
                            />
                            <Select
                                label="Rol"
                                value={editingUser.role}
                                onChange={(value) => setEditingUser({
                                    ...editingUser,
                                    role: value as 'user' | 'trader' | 'admin'
                                })}
                                options={[
                                    { value: 'user', label: 'Usuario' },
                                    { value: 'trader', label: 'Trader' },
                                    { value: 'admin', label: 'Administrador' }
                                ]}
                            />
                        </div>
                    )}
                </DialogContent>
                <DialogFooter>
                    <Button
                        variant="secondary"
                        onClick={() => setShowEditDialog(false)}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={() => editingUser && handleEditUser({
                            name: editingUser.name,
                            role: editingUser.role
                        })}
                    >
                        Guardar Cambios
                    </Button>
                </DialogFooter>
            </Dialog>
        </div>
    );
};

export default UserManagement;