import React, { useState } from 'react';
import { Card, Button, Input } from '../components/UI';
import { useInventory } from '../hooks/useInventory';
import { Plus, Search, Edit2, Trash2, Filter, Package } from 'lucide-react';
import { Product } from '../types';
import { cn } from '../utils/cn';

export const Inventory: React.FC = () => {
  const { products, loading } = useInventory();
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic">
            Inventário <span className="text-orange-500">Mestre</span>
          </h1>
          <p className="text-slate-500 text-xs font-mono uppercase tracking-[0.3em] mt-2">Gestão de Produtos e Lubrificantes</p>
        </div>
        <Button className="w-full md:w-auto">
          <Plus className="w-5 h-5" />
          Novo Produto
        </Button>
      </header>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input 
            type="text" 
            placeholder="Pesquisar por SKU ou Nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-800/40 border border-slate-700 rounded-2xl pl-14 pr-5 py-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
          />
        </div>
        <Button variant="outline" className="md:w-auto">
          <Filter className="w-5 h-5" />
          Filtros
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="py-24 flex justify-center">
            <div className="w-8 h-8 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
          </div>
        ) : (
          filteredProducts.map(product => (
            <Card key={product.id} className="p-0">
              <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center border border-slate-700">
                    <Package className="w-8 h-8 text-slate-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{product.name}</h3>
                    <div className="flex gap-3 mt-1">
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{product.id}</span>
                      <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest bg-orange-500/10 px-2 rounded">{product.category}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full md:w-auto">
                  <div className="text-center md:text-right">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Stock Atual</p>
                    <p className={cn('text-xl font-black', product.stock_current < (product.min_stock_alert || 5) ? 'text-red-400' : 'text-white')}>
                      {product.stock_current} <span className="text-xs opacity-50">{product.unit}</span>
                    </p>
                  </div>
                  <div className="text-center md:text-right">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Preço (PVP1)</p>
                    <p className="text-xl font-black text-orange-400">
                      {product.prices.pvp1.toLocaleString()} <span className="text-xs opacity-50">Kz</span>
                    </p>
                  </div>
                  <div className="flex items-center justify-end gap-2 col-span-2 md:col-span-1">
                    <Button variant="ghost" size="icon">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-red-400 hover:bg-red-500/10">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
