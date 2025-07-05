// src/components/admin/CategoryManager.jsx

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, onSnapshot } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const CategoryManager = ({ onCategoryAdded }) => {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [feedback, setFeedback] = useState('');

    useEffect(() => {
        // Use onSnapshot for real-time updates
        const unsubscribe = onSnapshot(collection(db, 'categories'), (snapshot) => {
            const categoriesList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setCategories(categoriesList);
        });
        // Cleanup listener on component unmount
        return () => unsubscribe();
    }, []);

    const handleAddCategory = async (e) => {
        e.preventDefault();
        const trimmedCategory = newCategory.trim().toLowerCase();
        if (!trimmedCategory) return;
        
        // Prevent adding duplicate categories
        if (categories.some(cat => cat.name === trimmedCategory)) {
            setFeedback('Error: This category already exists.');
            return;
        }

        try {
            const docRef = await addDoc(collection(db, 'categories'), {
                name: trimmedCategory,
            });
            setFeedback(`Success: Category '${trimmedCategory}' added!`);
            setNewCategory('');
            if (onCategoryAdded) onCategoryAdded({ id: docRef.id, name: trimmedCategory });
        } catch (error) {
            console.error("Error adding category: ", error);
            setFeedback('Error: Could not add category.');
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Manage Categories</CardTitle>
            </CardHeader>
            <CardContent>
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
                </form>

                {feedback && (
                    <p className={`mt-2 text-sm ${feedback.startsWith('Error') ? 'text-red-500' : 'text-green-500'}`}>
                        {feedback}
                    </p>
                )}

                <div className="mt-6">
                    <h3 className="font-semibold mb-2">Existing Categories:</h3>
                    <ul className="space-y-1 list-disc list-inside text-sm">
                        {categories.sort((a, b) => a.name.localeCompare(b.name)).map(cat => (
                            <li key={cat.id}>{cat.name}</li>
                        ))}
                    </ul>
                </div>
            </CardContent>
        </Card>
    );
};

export default CategoryManager;