'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/logo';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Folder } from 'lucide-react';
import { projects } from '@/lib/data';

const mainNav = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 flex-shrink-0 border-r bg-card hidden md:flex flex-col">
      <div className="h-16 flex items-center px-6 border-b">
        <Link href="/dashboard">
          <Logo />
        </Link>
      </div>
      <nav className="flex-1 px-4 py-4 space-y-4">
        <div>
          {mainNav.map((item) => (
            <Link href={item.href} key={item.href}>
              <Button
                variant={pathname === item.href ? 'secondary' : 'ghost'}
                className="w-full justify-start"
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            </Link>
          ))}
        </div>
        <div className="space-y-2">
            <h3 className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Projects</h3>
            <div className="space-y-1">
                {projects.map((project) => (
                    <Link href={`/project/${project.id}`} key={project.id}>
                        <Button
                            variant={pathname.includes(project.id) ? 'secondary' : 'ghost'}
                            className="w-full justify-start"
                        >
                            <Folder className="mr-2 h-4 w-4" />
                            <span className="truncate">{project.name}</span>
                        </Button>
                    </Link>
                ))}
            </div>
        </div>
      </nav>
    </aside>
  );
}
