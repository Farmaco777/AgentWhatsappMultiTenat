import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BotWhatsapp',
  description: 'Panel de operaciones inteligentes para tu restaurante.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
