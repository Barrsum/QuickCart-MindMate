import ProductManager from '@/components/admin/ProductManager';

const AdminDashboard = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Product Dashboard</h1>
            <p className="text-muted-foreground mb-8">View, toggle, and delete existing products.</p>
            <ProductManager />
        </div>
    );
};
export default AdminDashboard;