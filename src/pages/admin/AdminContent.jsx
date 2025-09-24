import ProductForm from '@/components/admin/ProductForm';
import CategoryManager from '@/components/admin/CategoryManager';

const AdminContent = () => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-1">
                <CategoryManager />
            </div>
            <div className="lg:col-span-2">
                <ProductForm />
            </div>
        </div>
    );
};
export default AdminContent;