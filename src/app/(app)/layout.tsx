'use client';

import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { AppProvider } from '@/context/app-provider';
import { projects as initialProjects, feedback as initialFeedback } from '@/lib/data';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider initialProjects={initialProjects} initialFeedback={initialFeedback}>
      <div className="flex h-full">
        <Sidebar />
        <div className="flex flex-col flex-1">
          <Header />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-background overflow-y-auto">
              {children}
          </main>
        </div>
      </div>
    </AppProvider>
  );
}
