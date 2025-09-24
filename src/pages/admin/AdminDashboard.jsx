// src/pages/admin/AdminDashboard.jsx

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getCountFromServer } from 'firebase/firestore';
import ProductManager from '@/components/admin/ProductManager';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Shapes, Users } from 'lucide-react';

const StatCard = ({ title, value, icon, loading }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            {icon}
        </CardHeader>
        <CardContent>
            {loading ? (
                <div className="text-2xl font-bold">...</div>
            ) : (
                <div className="text-2xl font-bold">{value}</div>
            )}
        </CardContent>
    </Card>
);

const AdminDashboard = () => {
    const [stats, setStats] = useState({ products: 0, categories: 0, users: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const productsSnap = await getCountFromServer(collection(db, "products"));
                const categoriesSnap = await getCountFromServer(collection(db, "categories"));
                const usersSnap = await getCountFromServer(collection(db, "users"));
                setStats({
                    products: productsSnap.data().count,
                    categories: categoriesSnap.data().count,
                    users: usersSnap.data().count,
                });
            } catch (error) {
                console.error("Failed to fetch stats:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground">An overview of your store's data.</p>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <StatCard title="Total Products" value={stats.products} icon={<Package className="h-4 w-4 text-muted-foreground" />} loading={loading} />
                <StatCard title="Total Categories" value={stats.categories} icon={<Shapes className="h-4 w-4 text-muted-foreground" />} loading={loading} />
                {/* <StatCard title="Total Users" value={stats.users} icon={<Users className="h-4 w-4 text-muted-foreground" />} loading={loading} /> */}
            </div>

            <ProductManager />
        </div>
    );
};

export default AdminDashboard;