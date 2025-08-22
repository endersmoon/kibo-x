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
import { UserMenu } from '@/components/user-menu';
import { AuthModal } from '@/components/auth-modal';
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
    <Sidebar className="h-screen  flex-shrink-0">
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
    <div className="h-screen w-screen overflow-hidden">
      <SidebarProvider>
        <AppSidebar />
        <main className="flex-1 h-screen overflow-hidden flex flex-col">
          <div className="flex h-16 items-center gap-4 border-b bg-background px-4">
            <SidebarTrigger />
            <div className="flex-1" />
            <UserMenu />
          </div>
          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
        <AuthModal />
      </SidebarProvider>
    </div>
  );
}
