import { useState, useEffect } from 'react';
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  increment,
  addDoc,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { Product, Transaction } from '../types';

export const useInventory = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) {
      console.warn('Firebase DB is not initialized. Using empty products list.');
      setProducts([]);
      setLoading(false);
      return;
    }

    try {
      const unsubscribe = onSnapshot(
        collection(db, 'products'),
        (snapshot) => {
          const productList = snapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          })) as Product[];
          setProducts(productList);
          setLoading(false);
        },
        (error) => {
          console.error('Error fetching products:', error);
          setLoading(false);
        },
      );

      return () => unsubscribe();
    } catch (error) {
      console.error('Error setting up snapshot:', error);
      setLoading(false);
    }
  }, []);

  const updateStockAndLog = async (productId: string, quantity: number, orderId: string) => {
    if (!db) return;
    const productRef = doc(db, 'products', productId);

    await updateDoc(productRef, {
      stock_current: increment(-quantity),
    });

    await addDoc(collection(db, 'transactions'), {
      product_id: productId,
      type: 'Saída_Obra',
      quantity: quantity,
      timestamp: serverTimestamp(),
      reference_id: orderId,
    });
  };

  const validateStock = (productId: string, quantity: number) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return false;
    return product.stock_current >= quantity;
  };

  // ESTA É A FUNÇÃO QUE ESTÁ A FALTAR NO SEU VS CODE
  const importProducts = async (importedProducts: Partial<Product>[]) => {
    if (!db) {
      console.warn('Firebase DB is not initialized. Cannot import products.');
      return;
    }

    try {
      const batches = [];
      let currentBatch = writeBatch(db);
      let operationCount = 0;

      for (const product of importedProducts) {
        if (!product.id) continue;

        const productRef = doc(db, 'products', product.id);

        currentBatch.set(
          productRef,
          {
            ...product,
            updatedAt: serverTimestamp(),
          },
          { merge: true },
        );

        operationCount++;

        if (operationCount === 500) {
          batches.push(currentBatch.commit());
          currentBatch = writeBatch(db);
          operationCount = 0;
        }
      }

      if (operationCount > 0) {
        batches.push(currentBatch.commit());
      }

      await Promise.all(batches);
      return true;
    } catch (error) {
      console.error('Error importing products:', error);
      throw error;
    }
  };

  // CERTIFIQUE-SE QUE 'importProducts' ESTÁ NESTA LISTA ABAIXO
  return { products, loading, updateStockAndLog, validateStock, importProducts };
};
