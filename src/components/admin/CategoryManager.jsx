// src/components/admin/CategoryManager.jsx

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, onSnapshot, doc, updateDoc, writeBatch, query, where, getDocs } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Pencil, Trash2, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';

const CategoryManager = () => {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [feedback, setFeedback] = useState('');

    // --- State for Edit and Delete ---
    const [editingCategoryId, setEditingCategoryId] = useState(null);
    const [editingCategoryName, setEditingCategoryName] = useState('');

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'categories'), (snapshot) => {
            const categoriesList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setCategories(categoriesList);
        });
        return () => unsubscribe();
    }, []);

    const handleAddCategory = async (e) => {
        e.preventDefault();
        const trimmedCategory = newCategory.trim().toLowerCase();
        if (!trimmedCategory) return;
        
        if (categories.some(cat => cat.name === trimmedCategory)) {
            setFeedback('Error: This category already exists.');
            return;
        }
        try {
            await addDoc(collection(db, 'categories'), { name: trimmedCategory });
            toast.success(`Category '${trimmedCategory}' added!`);
            setNewCategory('');
            setFeedback('');
        } catch (error) {
            toast.error('Could not add category.');
            console.error("Error adding category: ", error);
        }
    };

    // --- Edit Logic ---
    const startEditing = (category) => {
        setEditingCategoryId(category.id);
        setEditingCategoryName(category.name);
    };

    const cancelEditing = () => {
        setEditingCategoryId(null);
        setEditingCategoryName('');
    };

    const handleUpdateCategory = async () => {
        if (!editingCategoryName.trim()) return;
        const categoryRef = doc(db, 'categories', editingCategoryId);
        try {
            await updateDoc(categoryRef, { name: editingCategoryName.trim().toLowerCase() });
            toast.success('Category updated!');
            cancelEditing();
        } catch (error) {
            toast.error('Failed to update category.');
            console.error("Error updating category: ", error);
        }
    };

    // --- Delete Logic ---
    const handleConfirmDelete = async (categoryToDelete) => {
        const toastId = toast.loading(`Deleting '${categoryToDelete.name}' and all its products...`);
        try {
            // Step 1: Find all products in this category
            const productsQuery = query(collection(db, "products"), where("category", "==", categoryToDelete.name));
            const productsSnapshot = await getDocs(productsQuery);

            // Step 2: Use a Batched Write for atomic deletion
            const batch = writeBatch(db);

            // Add all product deletions to the batch
            productsSnapshot.forEach((productDoc) => {
                batch.delete(doc(db, "products", productDoc.id));
            });
            
            // Add the category deletion to the batch
            batch.delete(doc(db, "categories", categoryToDelete.id));

            // Step 3: Commit the batch
            await batch.commit();

            toast.success(`'${categoryToDelete.name}' and ${productsSnapshot.size} products deleted.`, { id: toastId });
        } catch (error) {
            toast.error('Deletion failed. Please try again.', { id: toastId });
            console.error("Error deleting category and products: ", error);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Manage Categories</CardTitle>
                <CardDescription>Add, edit, or delete store categories.</CardDescription>
            </CardHeader>
            <CardContent>
                {/* Add Category Form */}
                <form onSubmit={handleAddCategory} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="newCategory">Add New Category</Label>
                        <Input 
                            id="newCategory" 
                            value={newCategory} 
                            onChange={(e) => { setNewCategory(e.target.value); setFeedback(''); }}
                            placeholder="e.g., beverages" 
                        />
                    </div>
                    <Button type="submit" className="w-full">Add Category</Button>
                    {feedback && <p className={`mt-2 text-sm ${feedback.startsWith('Error') ? 'text-red-500' : 'text-green-500'}`}>{feedback}</p>}
                </form>

                {/* Existing Categories List */}
                <div className="mt-6">
                    <h3 className="font-semibold mb-2">Existing Categories:</h3>
                    <div className="space-y-2">
                        {categories.sort((a, b) => a.name.localeCompare(b.name)).map(cat => (
                            <div key={cat.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted">
                                {editingCategoryId === cat.id ? (
                                    // Edit mode UI
                                    <div className="flex-grow flex items-center gap-2">
                                        <Input value={editingCategoryName} onChange={(e) => setEditingCategoryName(e.target.value)} className="h-8" />
                                        <Button size="icon" className="h-8 w-8" onClick={handleUpdateCategory}><Check className="h-4 w-4" /></Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={cancelEditing}><X className="h-4 w-4" /></Button>
                                    </div>
                                ) : (
                                    // Display mode UI
                                    <>
                                        <span className="capitalize">{cat.name}</span>
                                        <div className="flex items-center gap-2">
                                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => startEditing(cat)}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This action cannot be undone. This will permanently delete the 
                                                            <strong className="capitalize"> {cat.name} </strong> 
                                                            category and ALL products within it.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleConfirmDelete(cat)}>Continue</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default CategoryManager;