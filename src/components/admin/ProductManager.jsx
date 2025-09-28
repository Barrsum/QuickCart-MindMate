// src/components/admin/ProductManager.jsx

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Trash2, PlusCircle, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const ProductManager = () => {
    const [allProducts, setAllProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categories, setCategories] =useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false); // State for the popover

    const fetchData = async () => {
        setLoading(true);
        try {
            const [productsSnapshot, categoriesSnapshot] = await Promise.all([
                getDocs(collection(db, "products")),
                getDocs(collection(db, "categories"))
            ]);
            const productsList = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            const categoriesList = categoriesSnapshot.docs.map(doc => doc.data().name);
            setAllProducts(productsList);
            setFilteredProducts(productsList);
            setCategories(categoriesList.sort());
        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (selectedCategories.length === 0) {
            setFilteredProducts(allProducts);
        } else {
            const newFilteredProducts = allProducts.filter(product =>
                selectedCategories.includes(product.category)
            );
            setFilteredProducts(newFilteredProducts);
        }
    }, [selectedCategories, allProducts]);

    const handleCategorySelect = (categoryName) => {
        setSelectedCategories(prev => {
            if (prev.includes(categoryName)) {
                return prev.filter(c => c !== categoryName);
            } else {
                return [...prev, categoryName];
            }
        });
    };

    const handleToggle = async (productId, field, value) => {
        const productRef = doc(db, "products", productId);
        await updateDoc(productRef, { [field]: !value });
        fetchData();
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
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">Manage Existing Products</h3>

                    {/* --- NEW SEARCHABLE FILTER POPOVER --- */}
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="ml-auto">
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Filter Categories
                                {selectedCategories.length > 0 && (
                                    <span className="ml-2 inline-flex items-center justify-center rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground">
                                        {selectedCategories.length}
                                    </span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0" align="end">
                            <Command>
                                <CommandInput placeholder="Search category..." />
                                <CommandList>
                                    <CommandEmpty>No results found.</CommandEmpty>
                                    <CommandGroup>
                                        {categories.map((category) => {
                                            const isSelected = selectedCategories.includes(category);
                                            return (
                                                <CommandItem
                                                    key={category}
                                                    onSelect={() => handleCategorySelect(category)}
                                                >
                                                    <div className={cn("mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary", isSelected ? "bg-primary text-primary-foreground" : "opacity-50 [&_svg]:invisible")}>
                                                        <Check className={cn("h-4 w-4")} />
                                                    </div>
                                                    <span className="capitalize">{category}</span>
                                                </CommandItem>
                                            );
                                        })}
                                    </CommandGroup>
                                    {selectedCategories.length > 0 && (
                                        <CommandGroup>
                                            <CommandItem onSelect={() => setSelectedCategories([])} className="text-destructive justify-center">
                                                Clear filters
                                            </CommandItem>
                                        </CommandGroup>
                                    )}
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Hot Deal</TableHead>
                            <TableHead>Featured</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredProducts.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell className="font-medium">{product.name}</TableCell>
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