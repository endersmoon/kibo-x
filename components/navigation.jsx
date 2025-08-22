'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  Home, 
  Users, 
  Briefcase, 
  BarChart3,
  Settings,
  FileText
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';

const navigationItems = [
  
  {
    title: 'Requisitions',
    icon: Home,
    href: '/',
  },
  {
    title: 'All Candidates',
    icon: Users,
    href: '/candidates',
  },

];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="px-4 py-2">
          <h2 className="text-lg font-semibold tracking-tight">Kibo-X</h2>
          <p className="text-xs text-muted-foreground">Candidate Tracking</p>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.href}>
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="px-4 py-2 text-xs text-muted-foreground">
          © 2024 Kibo-X
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

export function SidebarLayout({ children }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1">
        <div className="flex h-16 items-center gap-4 border-b bg-background px-6">
          <SidebarTrigger />
          <div className="flex-1" />
        </div>
        <div className="flex-1">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}
