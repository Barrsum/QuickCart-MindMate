// src/components/admin/ProductForm.jsx

import { useState, useEffect } from 'react';
import { db, storage } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, doc, updateDoc, getDocs } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ProductForm = ({ onProductAdded }) => {
    // Form state
    const [productName, setProductName] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState(null);
    const [categories, setCategories] = useState([]);

    // UI Feedback state
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [feedback, setFeedback] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);

    useEffect(() => {
        const fetchCategories = async () => {
            const categoriesSnapshot = await getDocs(collection(db, 'categories'));
            const categoriesList = categoriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setCategories(categoriesList.sort((a, b) => a.name.localeCompare(b.name)));
        };
        fetchCategories();
    }, []);

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
            setFeedback('');
        }
    };

    const resetForm = () => {
        setProductName('');
        setSelectedCategory('');
        setPrice('');
        setImage(null);
        if (document.getElementById('image-input')) {
            document.getElementById('image-input').value = '';
        }
        setUploadProgress(0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!productName || !selectedCategory || !price || !image) {
            setFeedback('Error: All fields and an image are required.');
            return;
        }
        setIsSubmitting(true);
        setFeedback('');

        try {
            const productDocRef = await addDoc(collection(db, "products"), {
                name: productName,
                category: selectedCategory,
                price: parseFloat(price),
                imageUrl: '',
                createdAt: serverTimestamp(),
                isHotDeal: false,
                isFeatured: false,
            });

            const imagePath = `products/${selectedCategory}/${productDocRef.id}`;
            const storageRef = ref(storage, imagePath);
            const uploadTask = uploadBytesResumable(storageRef, image);

            uploadTask.on('state_changed',
                (snapshot) => setUploadProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100),
                (error) => { throw error; },
                async () => {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    await updateDoc(doc(db, "products", productDocRef.id), { imageUrl: downloadURL });

                    setFeedback('Success: Product added!');
                    resetForm();
                    setIsSubmitting(false);
                    if (onProductAdded) onProductAdded(); // Notify parent to refresh product list
                }
            );
        } catch (error) {
            console.error("Error adding product: ", error);
            setFeedback(`Error: ${error.message}`);
            setIsSubmitting(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Add New Product</CardTitle>
                <CardDescription>Use this form to add a new item to the store.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="productName">Product Name</Label>
                        <Input id="productName" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="e.g., Tide Pods" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Select onValueChange={setSelectedCategory} value={selectedCategory}>
                                <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                                <SelectContent>
                                    {categories.map(cat => <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="price">Price (₹)</Label>
                            <Input id="price" type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="e.g., 550.00" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="image-input">Product Image</Label>
                        <Input id="image-input" type="file" onChange={handleImageChange} accept="image/png, image/jpeg, image/webp" />
                    </div>
                    {isSubmitting && <Progress value={uploadProgress} className="w-full" />}
                    {feedback && <p className={`text-sm ${feedback.startsWith('Error') ? 'text-red-500' : 'text-green-500'}`}>{feedback}</p>}
                    <Button type="submit" disabled={isSubmitting || !selectedCategory} className="w-full">
                        {isSubmitting ? 'Adding...' : 'Add Product'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

export default ProductForm;