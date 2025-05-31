// src/app/admin/usuarios/page.tsx
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
    Spinner
} from '@/components/ui';
import { ExcelExport } from '@/components/admin';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { useToast } from '@/hooks';
import type { AdminUser } from '@/types/admin';

export default function AdminUsersPage() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { showError } = useToast();

    const fetchUsers = async () => {
        try {
            setLoading(true);

            const response = await fetch('/api/admin/users', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.success) {
                setUsers(data.data.users || []);
                setFilteredUsers(data.data.users || []);
            } else {
                throw new Error(data.message || 'Error al obtener usuarios');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            showError('Error al cargar usuarios', errorMessage);
            console.error('Error fetching users:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Filter users based on search term
    useEffect(() => {
        if (!searchTerm) {
            setFilteredUsers(users);
        } else {
            const filtered = users.filter(user =>
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.dni.includes(searchTerm)
            );
            setFilteredUsers(filtered);
        }
    }, [searchTerm, users]);

    const getRoleBadgeVariant = (role: string) => {
        switch (role) {
            case 'admin':
                return 'destructive';
            case 'trader':
                return 'warning';
            default:
                return 'secondary';
        }
    };

    const getRoleLabel = (role: string) => {
        switch (role) {
            case 'admin':
                return 'Admin';
            case 'trader':
                return 'Trader';
            default:
                return 'Usuario';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <Spinner size="lg" className="mb-4" />
                    <p className="text-muted-foreground">Cargando usuarios...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Gestión de Usuarios</h1>
                    <p className="text-muted-foreground mt-1">
                        Lista completa de participantes y administradores
                    </p>
                </div>

                <ExcelExport
                    variant="button"
                    size="lg"
                    filename="usuarios_evento_trading"
                    includeOperations={true}
                />
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="text-center">
                            <p className="text-2xl font-bold">{users.length}</p>
                            <p className="text-sm text-muted-foreground">Total Usuarios</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-trade-green">
                                {users.filter(u => u.role === 'user').length}
                            </p>
                            <p className="text-sm text-muted-foreground">Participantes</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-yellow-500">
                                {users.filter(u => u.role === 'trader').length}
                            </p>
                            <p className="text-sm text-muted-foreground">Traders</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-destructive">
                                {users.filter(u => u.role === 'admin').length}
                            </p>
                            <p className="text-sm text-muted-foreground">Admins</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Search and Filters */}
            <Card>
                <CardHeader>
                    <CardTitle>Buscar Usuarios</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center space-x-4">
                        <div className="flex-1">
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
                        </div>
                        <Button
                            variant="secondary"
                            onClick={() => setSearchTerm('')}
                            disabled={!searchTerm}
                        >
                            Limpiar
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
                                    <TableHead>Registro</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUsers.map((user) => (
                                    <TableRow key={user.id}>
                                        {/* User Info */}
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">{user.name}</p>
                                                <p className="text-sm text-muted-foreground">ID: {user.id.slice(-8)}</p>
                                            </div>
                                        </TableCell>

                                        {/* Contact */}
                                        <TableCell>
                                            <div className="space-y-1">
                                                <p className="text-sm">{user.email}</p>
                                                <p className="text-sm text-muted-foreground">DNI: {user.dni}</p>
                                                <p className="text-sm text-muted-foreground">{user.phone}</p>
                                            </div>
                                        </TableCell>

                                        {/* Balances */}
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

                                        {/* Performance */}
                                        <TableCell>
                                            <div className="space-y-1">
                                                <div className="flex items-center space-x-2">
                                                    <Badge variant={user.profitPercentage >= 0 ? 'success' : 'destructive'} size="sm">
                                                        {user.profitPercentage >= 0 ? '+' : ''}{user.profitPercentage.toFixed(2)}%
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-muted-foreground">
                                                    Pos. #{user.rankingPosition} • {user.completedOperations} ops
                                                </p>
                                            </div>
                                        </TableCell>

                                        {/* Role */}
                                        <TableCell>
                                            <Badge variant={getRoleBadgeVariant(user.role)} size="sm">
                                                {getRoleLabel(user.role)}
                                            </Badge>
                                        </TableCell>

                                        {/* Registration */}
                                        <TableCell>
                                            <div className="space-y-1">
                                                <p className="text-sm">{formatDateTime(user.registrationDate)}</p>
                                                {user.lastLogin && (
                                                    <p className="text-xs text-muted-foreground">
                                                        Último: {formatDateTime(user.lastLogin)}
                                                    </p>
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
                                {searchTerm ? 'No se encontraron usuarios que coincidan con la búsqueda' : 'No hay usuarios registrados'}
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
