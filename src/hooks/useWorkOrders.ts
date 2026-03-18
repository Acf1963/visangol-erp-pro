import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { WorkOrder } from '@/types';

export function useWorkOrders() {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) {
      console.warn('Firebase DB is not initialized. Using empty work orders list.');
      setWorkOrders([]);
      setLoading(false);
      return;
    }

    try {
      const q = query(collection(db, 'workOrders'), orderBy('created_at', 'desc'), limit(50));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const list = snapshot.docs.map((doc) => ({
            ...doc.data(),
            order_id: doc.id,
          })) as WorkOrder[];
          setWorkOrders(list);
          setLoading(false);
        },
        (error) => {
          console.error('Error fetching work orders:', error);
          setLoading(false);
        },
      );

      return () => unsubscribe();
    } catch (error) {
      console.error('Error setting up snapshot:', error);
      setLoading(false);
    }
  }, []);

  return { workOrders, loading };
}

export default useWorkOrders;
