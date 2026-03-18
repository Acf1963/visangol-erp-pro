import React from 'react';
import { Card } from '@/components/UI';
import { useWorkOrders } from '@/hooks/useWorkOrders';
import { Clock, CheckCircle2, AlertCircle, ChevronRight, User, Car } from 'lucide-react';
import { cn } from '@/utils/cn';

export const History: React.FC = () => {
  const { workOrders, loading } = useWorkOrders();

  return (
    <div className="space-y-8 pb-8">
      <header>
        <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic">
          Histórico <span className="text-orange-500">de Obras</span>
        </h1>
        <p className="text-slate-500 text-xs font-mono uppercase tracking-[0.3em] mt-2">
          Registo Geral de Atividade
        </p>
      </header>

      <div className="space-y-4">
        {loading ? (
          <div className="py-24 flex justify-center">
            <div className="w-8 h-8 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
          </div>
        ) : (
          workOrders.map((order) => (
            <Card
              key={order.order_id}
              className="p-0 hover:bg-slate-800/60 transition-colors cursor-pointer group"
            >
              <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-6">
                  <div
                    className={cn(
                      'w-14 h-14 rounded-2xl flex items-center justify-center',
                      order.status === 'Concluída' ? 'bg-orange-500/10' : 'bg-amber-500/10',
                    )}
                  >
                    {order.status === 'Concluída' ? (
                      <CheckCircle2 className="w-7 h-7 text-orange-500" />
                    ) : (
                      <Clock className="w-7 h-7 text-amber-500" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-bold text-white">{order.client_name}</h3>
                      <span
                        className={cn(
                          'text-[10px] font-bold uppercase px-2 py-0.5 rounded-full',
                          order.status === 'Concluída'
                            ? 'bg-orange-500/10 text-orange-500'
                            : 'bg-amber-500/10 text-amber-500',
                        )}
                      >
                        {order.status}
                      </span>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Car className="w-3.5 h-3.5" />
                        <span className="text-xs font-mono uppercase tracking-widest">
                          {order.vehicle_plate}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="text-xs">
                          {order.created_at?.toDate
                            ? order.created_at.toDate().toLocaleDateString()
                            : 'Recent'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                  <div className="text-right">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">
                      Valor Total
                    </p>
                    <p className="text-xl font-black text-white">
                      {order.total_amount.toLocaleString()}{' '}
                      <span className="text-xs opacity-50 text-orange-500">Kz</span>
                    </p>
                  </div>
                  <ChevronRight className="w-6 h-6 text-slate-700 group-hover:text-orange-500 transition-colors" />
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
