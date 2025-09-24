// src/pages/admin/AdminContent.jsx

import ProductForm from '@/components/admin/ProductForm';
import CategoryManager from '@/components/admin/CategoryManager';

const AdminContent = () => {
    return (
        <div className="space-y-8">
             <div>
                <h1 className="text-3xl font-bold">Add Content</h1>
                <p className="text-muted-foreground">Add new categories and products to your store.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-1">
                    <CategoryManager />
                </div>
                <div className="lg:col-span-2">
                    <ProductForm />
                </div>
            </div>
        </div>
    );
};

export default AdminContent;