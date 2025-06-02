// src/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastProvider, AuthProvider, SocketProvider, ConnectionStatus } from '@/components/providers';
import { ToastContextProvider } from '@/components/providers/toast-context';

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Trading Simulator | Fintech Event",
    description: "Simulador de trading para evento de networking fintech",
    manifest: "/manifest.json",
    icons: {
        icon: [
            { url: "/favicon.ico" },
            { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
        ],
        apple: [
            { url: "/icons/icon-192x192.png" },
        ],
    },
    viewport: {
        width: "device-width",
        initialScale: 1,
        maximumScale: 1,
        userScalable: false,
    },
    themeColor: "#3b82f6",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es">
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
        >
            <ToastProvider>
                <ToastContextProvider>
                    <AuthProvider>
                        <SocketProvider>
                            {children}
                            <ConnectionStatus />
                        </SocketProvider>
                    </AuthProvider>
                </ToastContextProvider>
            </ToastProvider>
        </body>
        </html>
    );
}