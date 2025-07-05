// src/pages/AdminPage.jsx

import ProductForm from '@/components/admin/ProductForm';
import CategoryManager from '@/components/admin/CategoryManager';
import ProductManager from '@/components/admin/ProductManager';
import SettingsManager from '@/components/admin/SettingsManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminPage = () => {
    return (
        <div className="container mx-auto p-4 md:p-8">
            <h1 className="text-3xl font-bold mb-8 text-center">Admin Dashboard</h1>

            <Tabs defaultValue="products" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="products">Manage Products</TabsTrigger>
                    <TabsTrigger value="categories">Manage Categories</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                
                <TabsContent value="products" className="mt-6">
                    <ProductManager />
                </TabsContent>
                
                <TabsContent value="categories" className="mt-6">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                        <CategoryManager />
                        <ProductForm />
                    </div>
                </TabsContent>

                <TabsContent value="settings" className="mt-6">
                    <SettingsManager />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default AdminPage;