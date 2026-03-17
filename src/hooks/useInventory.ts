import { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, updateDoc, increment, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Product, Transaction } from '../types';

export const useInventory = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) {
      console.warn("Firebase DB is not initialized. Using empty products list.");
      setProducts([]);
      setLoading(false);
      return;
    }

    try {
      const unsubscribe = onSnapshot(collection(db, 'products'), (snapshot) => {
        const productList = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id // Using the document ID as the SKU/ID if not provided in data
        })) as Product[];
        setProducts(productList);
        setLoading(false);
      }, (error) => {
        console.error("Error fetching products:", error);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error("Error setting up snapshot:", error);
      setLoading(false);
    }
  }, []);

  const updateStockAndLog = async (productId: string, quantity: number, orderId: string) => {
    if (!db) return;
    const productRef = doc(db, 'products', productId);
    
    // Update stock
    await updateDoc(productRef, {
      stock_current: increment(-quantity)
    });

    // Log transaction
    await addDoc(collection(db, 'transactions'), {
      product_id: productId,
      type: 'Saída_Obra',
      quantity: quantity,
      timestamp: serverTimestamp(),
      reference_id: orderId
    });
  };

  const validateStock = (productId: string, quantity: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return false;
    return product.stock_current >= quantity;
  };

  return { products, loading, updateStockAndLog, validateStock };
};
