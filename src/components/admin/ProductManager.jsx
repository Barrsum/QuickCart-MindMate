// src/components/admin/ProductManager.jsx

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

const ProductManager = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchProducts = async () => {
        setLoading(true);
        const productsSnapshot = await getDocs(collection(db, "products"));
        const productsList = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(productsList);
        setLoading(false);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleToggle = async (productId, field, value) => {
        const productRef = doc(db, "products", productId);
        await updateDoc(productRef, { [field]: !value });
        // Refresh the product list to show the change
        fetchProducts();
    };

    const handleDelete = async (productId) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            await deleteDoc(doc(db, "products", productId));
            // Note: Also delete the image from storage for a full solution (omitted for hackathon simplicity)
            fetchProducts();
        }
    };

    if (loading) return <p>Loading products...</p>;

    return (
        <div>
            <h3 className="text-xl font-bold mb-4">Manage Existing Products</h3>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Hot Deal</TableHead>
                        <TableHead>Featured</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products.map((product) => (
                        <TableRow key={product.id}>
                            <TableCell>{product.name}</TableCell>
                            <TableCell>
                                <Switch
                                    checked={product.isHotDeal}
                                    onCheckedChange={() => handleToggle(product.id, 'isHotDeal', product.isHotDeal)}
                                />
                            </TableCell>
                            <TableCell>
                                <Switch
                                    checked={product.isFeatured}
                                    onCheckedChange={() => handleToggle(product.id, 'isFeatured', product.isFeatured)}
                                />
                            </TableCell>
                            <TableCell>
                                <Button variant="destructive" size="icon" onClick={() => handleDelete(product.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default ProductManager;