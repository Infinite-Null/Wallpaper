"use client";

import { logoutUser } from "@/api/auth";
import AuthProvider from "@/components/provider/auth";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import APP from "@/constants/app";
import { Home, LogOut, Shield, ShieldUser } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

const navigationRoutes = [
  {
    name: "Home",
    route: "/home",
    icon: Home,
  },
  {
    name: "Admins",
    route: "/admins",
    icon: ShieldUser,
  },
  {
    name: "Logout",
    route: "/logout",
    icon: LogOut,
  },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logoutUser();
      router.push("/login");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      router.push("/login");
    }
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar className="border-r">
        <SidebarHeader className="border-b px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md border bg-background">
              <Shield className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-semibold">
                {APP.name.toUpperCase()}
              </span>
              <span className="text-sm text-muted-foreground">Admin Panel</span>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigationRoutes.map((item) => {
                  const Icon = item.icon;
                  const isLogout = item.name === "Logout";

                  return (
                    <SidebarMenuItem key={item.route}>
                      <SidebarMenuButton
                        asChild={!isLogout}
                        className={`
                          relative transition-all duration-200 border border-transparent
                          hover:border-border hover:bg-accent/50
                          ${
                            isLogout
                              ? "hover:border-destructive/30 hover:bg-destructive/5 cursor-pointer"
                              : ""
                          }
                        `}
                        onClick={isLogout ? handleLogout : undefined}
                      >
                        {isLogout ? (
                          <div className="flex items-center gap-3 px-1 py-2">
                            <Icon className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                            <span className="text-[15.6px] text-foreground hover:text-destructive">
                              {item.name}
                            </span>
                          </div>
                        ) : (
                          <Link
                            href={item.route}
                            className="flex items-center gap-3 px-3 py-2"
                          >
                            <Icon className="h-4 w-4 text-muted-foreground" />
                            <span className="text-[15.6px] text-foreground">
                              {item.name}
                            </span>
                          </Link>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <main className="flex-1 bg-background min-h-screen">
        <AuthProvider>
          <div className="p-6">{children}</div>
        </AuthProvider>
      </main>
    </SidebarProvider>
  );
}
