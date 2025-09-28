// src/components/admin/ProductManager.jsx

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils'; // Import cn for conditional classes

const ProductManager = () => {
    // --- NEW STATE MANAGEMENT ---
    const [allProducts, setAllProducts] = useState([]); // Master list of all products
    const [filteredProducts, setFilteredProducts] = useState([]); // Products to display after filtering
    const [categories, setCategories] = useState([]); // List of available categories for filters
    const [selectedCategories, setSelectedCategories] = useState([]); // Currently active filters
    const [loading, setLoading] = useState(true);

    // --- UPDATED FETCH LOGIC ---
    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch both products and categories at the same time
            const [productsSnapshot, categoriesSnapshot] = await Promise.all([
                getDocs(collection(db, "products")),
                getDocs(collection(db, "categories"))
            ]);

            const productsList = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            const categoriesList = categoriesSnapshot.docs.map(doc => doc.data().name);

            setAllProducts(productsList);
            setFilteredProducts(productsList); // Initially, show all products
            setCategories(categoriesList.sort()); // Sort categories alphabetically
        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // --- NEW FILTERING LOGIC ---
    useEffect(() => {
        if (selectedCategories.length === 0) {
            setFilteredProducts(allProducts); // If no filter, show all
        } else {
            // Filter the master list based on selected categories
            const newFilteredProducts = allProducts.filter(product =>
                selectedCategories.includes(product.category)
            );
            setFilteredProducts(newFilteredProducts);
        }
    }, [selectedCategories, allProducts]);

    const handleCategoryFilter = (categoryName) => {
        setSelectedCategories(prev => {
            if (prev.includes(categoryName)) {
                // If already selected, remove it (deselect)
                return prev.filter(c => c !== categoryName);
            } else {
                // Otherwise, add it to the selection
                return [...prev, categoryName];
            }
        });
    };

    const handleToggle = async (productId, field, value) => {
        const productRef = doc(db, "products", productId);
        await updateDoc(productRef, { [field]: !value });
        fetchData(); // Refetch all data to ensure consistency
    };

    const handleDelete = async (productId) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            await deleteDoc(doc(db, "products", productId));
            fetchData();
        }
    };

    if (loading) return <p>Loading products...</p>;

    return (
        <Card>
            <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Manage Existing Products</h3>

                {/* --- NEW FILTER BAR UI --- */}
                <div className="flex items-center gap-2 flex-wrap mb-6 pb-6 border-b">
                    <Button
                        variant={selectedCategories.length === 0 ? 'default' : 'outline'}
                        onClick={() => setSelectedCategories([])}
                        className="rounded-full"
                    >
                        All
                    </Button>
                    {categories.map(category => (
                        <Button
                            key={category}
                            variant={selectedCategories.includes(category) ? 'default' : 'outline'}
                            onClick={() => handleCategoryFilter(category)}
                            className="rounded-full capitalize"
                        >
                            {category}
                        </Button>
                    ))}
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            {/* --- NEW CATEGORY COLUMN HEADER --- */}
                            <TableHead>Category</TableHead>
                            <TableHead>Hot Deal</TableHead>
                            <TableHead>Featured</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {/* Render the filtered products */}
                        {filteredProducts.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell className="font-medium">{product.name}</TableCell>
                                {/* --- NEW CATEGORY COLUMN CELL --- */}
                                <TableCell className="capitalize text-muted-foreground">{product.category}</TableCell>
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
                                <TableCell className="text-right">
                                    <Button variant="destructive" size="icon" onClick={() => handleDelete(product.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {filteredProducts.length === 0 && !loading && (
                    <p className="text-center text-muted-foreground py-8">
                        No products found for the selected filters.
                    </p>
                )}
            </CardContent>
        </Card>
    );
};

export default ProductManager;