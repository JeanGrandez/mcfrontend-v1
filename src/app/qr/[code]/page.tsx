// src/app/qr/[code]/page.tsx - Página de acceso por QR (Programador A)

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { TrendingUp, QrCode, Users, DollarSign } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface QRPageProps {
    params: {
        code: string;
    };
}

export default function QRPage({ params }: QRPageProps) {
    const router = useRouter();
    const [isValid, setIsValid] = useState<boolean | null>(null);
    const [eventInfo, setEventInfo] = useState<{
        name: string;
        description: string;
        date: string;
    } | null>(null);

    useEffect(() => {
        // Validate QR code
        const validateCode = async () => {
            try {
                // In a real implementation, this would validate against the backend
                // For now, we'll accept any code that looks like a valid event code
                const codePattern = /^event-\d{4}$/;
                const valid = codePattern.test(params.code);

                setIsValid(valid);

                if (valid) {
                    // Simulate event data
                    setEventInfo({
                        name: 'Networking Fintech 2024',
                        description: 'Evento de simulación de trading para profesionales fintech',
                        date: new Date().toLocaleDateString('es-PE', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })
                    });
                }
            } catch (error) {
                setIsValid(false);
            }
        };

        validateCode();
    }, [params.code]);

    if (isValid === null) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Validando código QR...</p>
                </div>
            </div>
        );
    }

    if (!isValid) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <div className="max-w-md mx-auto text-center">
                    <div className="bg-card rounded-lg p-8 border border-destructive/20">
                        <QrCode className="w-16 h-16 text-destructive mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-foreground mb-2">
                            Código QR Inválido
                        </h1>
                        <p className="text-muted-foreground mb-6">
                            El código QR escaneado no es válido o ha expirado.
                        </p>
                        <Link
                            href="/login"
                            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                        >
                            Ir al Login
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/5 to-background">
            {/* Header */}
            <header className="border-b border-border bg-background/80 backdrop-blur-sm">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center gap-2 text-xl font-bold text-foreground">
                        <TrendingUp className="w-6 h-6 text-primary" />
                        Trading Simulator
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-12">
                <div className="max-w-2xl mx-auto">
                    {/* Welcome Card */}
                    <div className="bg-card rounded-lg p-8 border shadow-lg mb-8">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <QrCode className="w-8 h-8 text-primary" />
                            </div>
                            <h1 className="text-3xl font-bold text-foreground mb-2">
                                ¡Bienvenido al Evento!
                            </h1>
                            <p className="text-muted-foreground">
                                Acceso directo al simulador de trading
                            </p>
                        </div>

                        {/* Event Info */}
                        {eventInfo && (
                            <div className="bg-muted/50 rounded-lg p-6 mb-8">
                                <h2 className="text-lg font-semibold text-foreground mb-3">
                                    {eventInfo.name}
                                </h2>
                                <p className="text-muted-foreground mb-2">
                                    {eventInfo.description}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    📅 {eventInfo.date}
                                </p>
                            </div>
                        )}

                        {/* Features */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="text-center p-4">
                                <DollarSign className="w-8 h-8 text-trade-green mx-auto mb-2" />
                                <h3 className="font-semibold text-foreground mb-1">
                                    Fondos Virtuales
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    $1,000 USD + S/. 3,500
                                </p>
                            </div>

                            <div className="text-center p-4">
                                <TrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
                                <h3 className="font-semibold text-foreground mb-1">
                                    Trading Real
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Operaciones en tiempo real
                                </p>
                            </div>

                            <div className="text-center p-4">
                                <Users className="w-8 h-8 text-trade-blue mx-auto mb-2" />
                                <h3 className="font-semibold text-foreground mb-1">
                                    Ranking
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Compite con otros participantes
                                </p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                href="/register"
                                className={cn(
                                    "flex-1 py-3 px-6 bg-primary text-primary-foreground rounded-lg",
                                    "hover:bg-primary/90 transition-colors text-center font-medium"
                                )}
                            >
                                Crear Cuenta Nueva
                            </Link>

                            <Link
                                href="/login"
                                className={cn(
                                    "flex-1 py-3 px-6 bg-secondary text-secondary-foreground rounded-lg",
                                    "hover:bg-secondary/90 transition-colors text-center font-medium"
                                )}
                            >
                                Ya Tengo Cuenta
                            </Link>
                        </div>
                    </div>

                    {/* Instructions */}
                    <div className="bg-card rounded-lg p-6 border">
                        <h3 className="font-semibold text-foreground mb-3">
                            Instrucciones:
                        </h3>
                        <ol className="space-y-2 text-sm text-muted-foreground">
                            <li>1. Regístrate con tu nombre, email, DNI y teléfono</li>
                            <li>2. Accede al mercado en vivo y observa las operaciones</li>
                            <li>3. Crea órdenes de compra/venta de dólares</li>
                            <li>4. Compite por obtener la mayor ganancia porcentual</li>
                            <li>5. Consulta tu posición en el ranking</li>
                        </ol>
                    </div>
                </div>
            </main>
        </div>
    );
}