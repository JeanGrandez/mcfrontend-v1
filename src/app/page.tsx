// src/app/page.tsx - Página principal (Programador A)

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { TrendingUp, Users, DollarSign, Target, ArrowRight } from 'lucide-react';
import { useAuthContext } from '@/components/providers/auth-provider';
import { cn } from '@/lib/utils';

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuthContext();
  const router = useRouter();

  // Redirect authenticated users to market
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/market');
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading while checking auth
  if (isLoading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    );
  }

  // Show landing page for unauthenticated users
  return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-background">
        {/* Header */}
        <header className="border-b border-border bg-background/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xl font-bold text-foreground">
                <TrendingUp className="w-6 h-6 text-primary" />
                Trading Simulator
              </div>

              <div className="flex items-center gap-4">
                <Link
                    href="/login"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Iniciar Sesión
                </Link>
                <Link
                    href="/register"
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Registrarse
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Simulador de{' '}
              <span className="text-primary">Trading</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Experimenta el trading de divisas en tiempo real con fondos virtuales.
              Perfecto para eventos de networking fintech.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link
                  href="/register"
                  className={cn(
                      "px-8 py-4 bg-primary text-primary-foreground rounded-lg",
                      "hover:bg-primary/90 transition-colors font-semibold",
                      "flex items-center justify-center gap-2"
                  )}
              >
                Empezar Ahora
                <ArrowRight className="w-5 h-5" />
              </Link>

              <Link
                  href="/login"
                  className={cn(
                      "px-8 py-4 bg-secondary text-secondary-foreground rounded-lg",
                      "hover:bg-secondary/90 transition-colors font-semibold"
                  )}
              >
                Ya Tengo Cuenta
              </Link>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="bg-card rounded-lg p-8 border">
                <DollarSign className="w-12 h-12 text-trade-green mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  Fondos Virtuales
                </h3>
                <p className="text-muted-foreground">
                  Comienza con $1,000 USD y S/. 3,500 para practicar sin riesgo.
                </p>
              </div>

              <div className="bg-card rounded-lg p-8 border">
                <TrendingUp className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  Tiempo Real
                </h3>
                <p className="text-muted-foreground">
                  Operaciones que se ejecutan en tiempo real con otros participantes.
                </p>
              </div>

              <div className="bg-card rounded-lg p-8 border">
                <Users className="w-12 h-12 text-trade-blue mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  Competencia
                </h3>
                <p className="text-muted-foreground">
                  Compite en el ranking y demuestra tus habilidades de trading.
                </p>
              </div>
            </div>

            {/* How It Works */}
            <div className="bg-card rounded-lg p-8 border">
              <h2 className="text-2xl font-bold text-foreground mb-8">
                ¿Cómo Funciona?
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-primary font-bold">1</span>
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">Regístrate</h4>
                  <p className="text-sm text-muted-foreground">
                    Crea tu cuenta con datos básicos
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-primary font-bold">2</span>
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">Observa</h4>
                  <p className="text-sm text-muted-foreground">
                    Ve el mercado en vivo y las órdenes
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-primary font-bold">3</span>
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">Opera</h4>
                  <p className="text-sm text-muted-foreground">
                    Crea órdenes de compra/venta
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-primary font-bold">4</span>
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">Compite</h4>
                  <p className="text-sm text-muted-foreground">
                    Sube en el ranking de ganancias
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-border bg-background/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center text-muted-foreground">
              <p>© 2024 Trading Simulator - Evento de Networking Fintech</p>
              <p className="mt-1 text-sm">
                Simulador educativo con fondos virtuales
              </p>
            </div>
          </div>
        </footer>
      </div>
  );
}