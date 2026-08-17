import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Sidebar } from '@/components/layout/Sidebar';
import { ProjectProvider } from '@/lib/project-context';

export const metadata: Metadata = {
  title: 'Sementinha do Mal - Financial Dashboard',
  description: 'Painel financeiro profissional para operações de marketing digital.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="bg-zinc-950 text-zinc-100 min-h-screen">
        <ProjectProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 flex flex-col min-w-0 min-h-screen overflow-y-auto">
              {children}
            </main>
          </div>
        </ProjectProvider>
      </body>
    </html>
  );
}
