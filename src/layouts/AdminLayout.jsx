// src/layouts/AdminLayout.jsx

import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, Settings, ShoppingCart, PanelLeftClose, PanelLeftOpen, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { cn } from '@/lib/utils';

const AdminLayout = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const NavLinks = ({ isMobile = false }) => {
        const navLinkClass = ({ isActive }) =>
            cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                isActive && "bg-muted text-primary"
            );

        const NavLinkWrapper = ({ to, end, children, label }) => {
            if (!isMobile && isCollapsed) {
                return (
                    <TooltipProvider delayDuration={100}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <NavLink to={to} end={end} className={navLinkClass}>
                                    {children}
                                </NavLink>
                            </TooltipTrigger>
                            <TooltipContent side="right">{label}</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                );
            }
            return (
                <NavLink to={to} end={end} className={navLinkClass}>
                    {children}
                </NavLink>
            );
        };
        
        return (
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                <NavLinkWrapper to="/admin" end label="Dashboard">
                    <LayoutDashboard className="h-4 w-4" />
                    {!isCollapsed && <span>Dashboard</span>}
                </NavLinkWrapper>
                <NavLinkWrapper to="/admin/content" label="Add Content">
                    <PlusCircle className="h-4 w-4" />
                    {!isCollapsed && <span>Add Content</span>}
                </NavLinkWrapper>
                <NavLinkWrapper to="/admin/settings" label="App Settings">
                    <Settings className="h-4 w-4" />
                    {!isCollapsed && <span>App Settings</span>}
                </NavLinkWrapper>
            </nav>
        );
    };

    return (
        <div className={cn(
            "grid min-h-screen w-full transition-[grid-template-columns] duration-300 ease-in-out",
            isCollapsed ? "md:grid-cols-[56px_1fr]" : "md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]"
        )}>
            <div className="hidden border-r bg-muted/40 md:block">
                <div className="flex h-full max-h-screen flex-col gap-2">
                    <div className="flex h-14 items-center border-b px-3 lg:h-[60px] lg:px-5 justify-between">
                        <NavLink to="/" className="flex items-center gap-2 font-semibold overflow-hidden">
                            <ShoppingCart className="h-6 w-6" />
                            <span className={cn("transition-opacity whitespace-nowrap", isCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto")}>
                                QuickCart Admin
                            </span>
                        </NavLink>
                        <Button variant="ghost" size="icon" className="shrink-0" onClick={() => setIsCollapsed(!isCollapsed)}>
                            {isCollapsed ? <PanelLeftOpen className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
                        </Button>
                    </div>
                    <div className="flex-1 py-4">
                        <NavLinks />
                    </div>
                </div>
            </div>
            <div className="flex flex-col">
                <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 md:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon" className="shrink-0">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle navigation menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="flex flex-col">
                            <SheetHeader className="sr-only">
                                <SheetTitle>Admin Menu</SheetTitle>
                                <SheetDescription>
                                    Navigate through the admin sections of QuickCart.
                                </SheetDescription>
                            </SheetHeader>
                            <NavLink to="/" className="flex items-center gap-2 text-lg font-semibold mb-4 border-b pb-4">
                                <ShoppingCart className="h-6 w-6" />
                                <span className="">QuickCart Admin</span>
                            </NavLink>
                            <NavLinks isMobile={true} />
                        </SheetContent>
                    </Sheet>
                    <div className="w-full flex-1"></div>
                </header>
                <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;