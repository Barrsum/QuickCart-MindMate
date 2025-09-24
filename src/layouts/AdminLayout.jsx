// src/layouts/AdminLayout.jsx

import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, Settings, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';

const AdminLayout = () => {
    const navLinkClass = ({ isActive }) =>
        cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
            isActive && "bg-muted text-primary"
        );

    return (
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <div className="hidden border-r bg-muted/40 md:block">
                <div className="flex h-full max-h-screen flex-col gap-2">
                    <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                        <NavLink to="/" className="flex items-center gap-2 font-semibold">
                            <ShoppingCart className="h-6 w-6" />
                            <span className="">QuickCart Admin</span>
                        </NavLink>
                    </div>
                    <div className="flex-1 py-4">
                        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                            <NavLink to="/admin" end className={navLinkClass}>
                                <LayoutDashboard className="h-4 w-4" />
                                Dashboard
                            </NavLink>
                            <NavLink to="/admin/content" className={navLinkClass}>
                                <PlusCircle className="h-4 w-4" />
                                Add Content
                            </NavLink>
                            <NavLink to="/admin/settings" className={navLinkClass}>
                                <Settings className="h-4 w-4" />
                                App Settings
                            </NavLink>
                        </nav>
                    </div>
                </div>
            </div>
            <div className="flex flex-col">
                <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;