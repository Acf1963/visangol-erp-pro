import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Product } from '../types';

interface StockAlertProps {
  products: Product[];
}

export const StockAlert: React.FC<StockAlertProps> = ({ products }) => {
  const criticalProducts = products.filter(p => p.stock_current < (p.min_stock_alert || 5));

  if (criticalProducts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-bounce">
      <div className="bg-red-600 text-white p-4 rounded-2xl shadow-2xl border-2 border-red-400 flex items-center gap-3">
        <AlertTriangle className="w-6 h-6" />
        <div>
          <p className="font-bold text-sm">Alerta de Stock Crítico!</p>
          <p className="text-xs opacity-90">{criticalProducts.length} itens abaixo de 5 unidades.</p>
        </div>
      </div>
    </div>
  );
};
