import React from 'react';
import { Card } from '../components/UI';
import { useInventory } from '../hooks/useInventory';
import { AlertTriangle, TrendingUp, Package, FileText, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '../utils/cn';

export const Dashboard: React.FC = () => {
  const { products } = useInventory();
  
  const criticalProducts = products.filter(p => p.stock_current < (p.min_stock_alert || 5));
  
  const stats = [
    { label: 'Stock Total', value: products.length, icon: Package, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Stock Crítico', value: criticalProducts.length, icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10' },
    { label: 'Obras Hoje', value: 12, icon: FileText, color: 'text-orange-400', bg: 'bg-orange-500/10' },
    { label: 'Faturação', value: '1.2M Kz', icon: TrendingUp, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  ];

  return (
    <div className="space-y-8 pb-8">
      <header>
        <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic">
          Dashboard <span className="text-orange-500">Visangol</span>
        </h1>
        <p className="text-slate-500 text-xs font-mono uppercase tracking-[0.3em] mt-2">Status do Sistema em Tempo Real</p>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={stat.label}>
            <Card className="p-0 border-none bg-slate-800/20">
              <div className="p-6 flex flex-col gap-4">
                <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center', stat.bg)}>
                  <stat.icon className={cn('w-6 h-6', stat.color)} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">{stat.label}</p>
                  <p className="text-2xl font-black text-white tracking-tight">{stat.value}</p>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card title="Alertas de Stock Crítico" icon={<AlertTriangle className="w-5 h-5 text-red-400" />}>
          <div className="space-y-4">
            {criticalProducts.length > 0 ? (
              criticalProducts.map(product => (
                <div key={product.id} className="flex justify-between items-center p-4 bg-red-500/5 border border-red-500/10 rounded-2xl">
                  <div>
                    <p className="font-bold text-slate-200">{product.name}</p>
                    <p className="text-[10px] font-mono text-slate-500">{product.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-red-400 font-black">{product.stock_current} {product.unit}</p>
                    <p className="text-[10px] text-slate-600">Mínimo: {product.min_stock_alert}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-slate-500 italic">
                <Package className="w-12 h-12 mx-auto mb-4 opacity-20" />
                Tudo em ordem. Nenhum item crítico.
              </div>
            )}
          </div>
        </Card>

        <Card title="Atividade Recente" icon={<TrendingUp className="w-5 h-5 text-orange-400" />}>
          <div className="space-y-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex items-center gap-4">
                <div className={cn('w-10 h-10 rounded-full flex items-center justify-center', i % 2 === 0 ? 'bg-orange-500/10' : 'bg-blue-500/10')}>
                  {i % 2 === 0 ? <ArrowUpRight className="w-5 h-5 text-orange-400" /> : <ArrowDownRight className="w-5 h-5 text-blue-400" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-200">
                    {i % 2 === 0 ? 'Saída de Stock - Obra #4521' : 'Entrada de Stock - Fornecedor'}
                  </p>
                  <p className="text-[10px] text-slate-500">Há {i * 15} minutos</p>
                </div>
                <p className={cn('font-mono font-bold', i % 2 === 0 ? 'text-orange-400' : 'text-blue-400')}>
                  {i % 2 === 0 ? '-5L' : '+60L'}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
