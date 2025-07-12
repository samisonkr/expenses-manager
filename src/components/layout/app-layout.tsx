
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  BookOpen,
  BarChart2,
  Settings,
  TrendingUp,
  PiggyBank,
  TrendingDown,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/journal", label: "Journal", icon: BookOpen },
  { href: "/expenses", label: "Expenses", icon: TrendingDown },
  { href: "/incomes", label: "Incomes", icon: TrendingUp },
  { href: "/insights", label: "Insights", icon: BarChart2 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, loading, signOut } = useAuth();

  if (pathname === "/login") {
    return <>{children}</>;
  }
  
  if (loading) {
    return (
        <div className="flex h-screen items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <PiggyBank className="h-12 w-12 animate-bounce" />
                <p>Loading your financial dashboard...</p>
            </div>
        </div>
    );
  }

  if (!user) {
    // This should be handled by the AuthProvider redirect, but as a fallback
    return null;
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Button
            variant="ghost"
            className="h-10 w-full justify-start px-2 font-headline text-lg font-semibold"
            asChild
          >
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <PiggyBank className="h-5 w-5" />
              </div>
              <span className="group-data-[collapsible=icon]:hidden">
                Expenses Manager
              </span>
            </Link>
          </Button>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={{ children: item.label }}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton onClick={signOut} tooltip={{ children: "Sign Out" }}>
                        <LogOut />
                        <span>Sign Out</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <SidebarTrigger className="md:hidden" />
          <h1 className="font-headline text-xl font-semibold md:hidden">
            Expenses Manager
          </h1>
        </header>
        <main className="flex flex-1 flex-col p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
