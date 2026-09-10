import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { ReportProvider } from '@/context/ReportContext';
import { Navbar } from '@/components/Navbar';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'BURGER Grúas - Reporte Diario de Trabajo Digital',
  description: 'Sistema digital de gestión de reportes de trabajo diario (Ficha BG_COM_F003_002) para Burger Grúas y Transportes Especiales.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${jetbrainsMono.variable} dark h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 font-sans">
        <ReportProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
        </ReportProvider>
      </body>
    </html>
  );
}
