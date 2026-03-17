import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Trash2, 
  Printer, 
  CheckCircle2, 
  Wrench, 
  Paintbrush, 
  Droplets,
  ChevronDown,
  X,
  Clock,
  Package
} from 'lucide-react';
import { useInventory } from '../hooks/useInventory';
import { Product, SectionType, WorkOrderItem, WorkOrder, WorkOrderSection } from '../types';
import { StockAlert } from '../components/StockAlert';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Button, Card, Input } from '../components/UI';
import { cn } from '../utils/cn';

const SECTIONS: SectionType[] = ['Mecânica', 'Pintura', 'Estação'];

// Dados de Exemplo (Rowe Oil)
const SEED_DATA: Product[] = [
  { 
    id: '20041-0050-99', 
    name: 'Óleo Motor 15W-40 PLUS - 5L', 
    category: 'Lubrificantes', 
    brand: 'ROWE OIL', 
    stock_initial: 20, 
    stock_current: 10, 
    prices: { pvp1: 42500, pvp2: 40000, pvp3: 38000 }, 
    unit: 'L', 
    min_stock_alert: 5 
  },
  { 
    id: '30007-0600-99', 
    name: 'Óleo Hidráulico HLP 68 - 60L', 
    category: 'Hidráulico', 
    brand: 'ROWE OIL', 
    stock_initial: 5, 
    stock_current: 3, 
    prices: { pvp1: 303750, pvp2: 290000, pvp3: 280000 }, 
    unit: 'L', 
    min_stock_alert: 5 
  },
  { 
    id: '50001-0500-99', 
    name: 'Massa Lubrificante EP 2 - 50kg', 
    category: 'Lubrificantes', 
    brand: 'ROWE OIL', 
    stock_initial: 20, 
    stock_current: 15, 
    prices: { pvp1: 461250, pvp2: 450000, pvp3: 440000 }, 
    unit: 'kg', 
    min_stock_alert: 5 
  }
];

export default function WorkOrderPage() {
  const { products, loading, updateStockAndLog } = useInventory();
  const [activeSection, setActiveSection] = useState<SectionType>('Mecânica');
  const [client_name, setClientName] = useState('');
  const [vehicle_plate, setVehiclePlate] = useState('');
  const [laborHours, setLaborHours] = useState<number>(0);
  const [hourlyRate, setHourlyRate] = useState<number>(5000);
  const [selectedItems, setSelectedItems] = useState<WorkOrderItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [priceLevel, setPriceLevel] = useState<'pvp1' | 'pvp2' | 'pvp3'>('pvp1');

  // Filtered products for searchable select
  const filteredProducts = useMemo(() => {
    const source = products.length > 0 ? products : SEED_DATA;
    return source.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  const addItem = (product: Product) => {
    const price = product.prices[priceLevel] || product.prices.pvp1;
    const existing = selectedItems.find(item => item.product_id === product.id);
    if (existing) {
      setSelectedItems(selectedItems.map(item => 
        item.product_id === product.id ? { 
          ...item, 
          quantity: item.quantity + 1,
          subtotal: (item.quantity + 1) * item.unit_price
        } : item
      ));
    } else {
      setSelectedItems([...selectedItems, {
        product_id: product.id,
        description: product.name,
        quantity: 1,
        unit_price: price,
        subtotal: price
      }]);
    }
    setIsDropdownOpen(false);
    setSearchTerm('');
  };

  const removeItem = (productId: string) => {
    setSelectedItems(selectedItems.filter(item => item.product_id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) return;
    setSelectedItems(selectedItems.map(item => 
      item.product_id === productId ? { 
        ...item, 
        quantity,
        subtotal: quantity * item.unit_price
      } : item
    ));
  };

  const totalLabor = laborHours * hourlyRate;
  const totalParts = selectedItems.reduce((acc, item) => acc + item.subtotal, 0);
  const grandTotal = totalParts + totalLabor;

  const handleFinishWork = async () => {
    if (!client_name || !vehicle_plate) {
      alert('Por favor, preencha o nome do cliente e a matrícula.');
      return;
    }

    if (!db) {
      alert('Firebase não está configurado. Não é possível concluir a obra.');
      return;
    }

    try {
      const workOrderData: Omit<WorkOrder, 'order_id'> = {
        status: 'Concluída',
        client_name,
        vehicle_plate,
        created_at: serverTimestamp(),
        sections: [
          {
            type: activeSection,
            items: selectedItems,
            labor: {
              hours: laborHours,
              hourly_rate: hourlyRate,
              total_labor: totalLabor
            }
          }
        ],
        total_amount: grandTotal,
        total_cost: totalParts * 0.7 // Exemplo de custo (70% do PVP)
      };

      const docRef = await addDoc(collection(db, 'workOrders'), workOrderData);

      // Update Stock and Log Transactions
      for (const item of selectedItems) {
        await updateStockAndLog(item.product_id, item.quantity, docRef.id);
      }

      alert('Obra finalizada com sucesso!');
      // Reset form
      setSelectedItems([]);
      setClientName('');
      setVehiclePlate('');
      setLaborHours(0);
    } catch (error) {
      console.error('Erro ao finalizar obra:', error);
      alert('Erro ao finalizar obra. Verifique a consola.');
    }
  };

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 100);
  };

  if (isPrinting) {
    return (
      <div className="p-12 bg-white text-black min-h-screen font-serif">
        <div className="flex justify-between items-start border-b-2 border-black pb-8 mb-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tighter">VISANGOL ERP</h1>
            <p className="text-sm italic">Gestão de Oficinas e Serviços</p>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-bold">ORÇAMENTO</h2>
            <p className="text-sm">Data: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-12">
          <div>
            <h3 className="text-xs uppercase tracking-widest font-bold opacity-50 mb-2">Cliente</h3>
            <p className="text-xl">{client_name}</p>
          </div>
          <div>
            <h3 className="text-xs uppercase tracking-widest font-bold opacity-50 mb-2">Veículo / Matrícula</h3>
            <p className="text-xl">{vehicle_plate}</p>
          </div>
          <div>
            <h3 className="text-xs uppercase tracking-widest font-bold opacity-50 mb-2">Secção</h3>
            <p className="text-xl">{activeSection}</p>
          </div>
        </div>

        <table className="w-full mb-12 border-collapse">
          <thead>
            <tr className="border-b-2 border-black text-left">
              <th className="py-2">Peça / Material</th>
              <th className="py-2 text-right">Qtd</th>
              <th className="py-2 text-right">P. Unitário</th>
              <th className="py-2 text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {selectedItems.map(item => (
              <tr key={item.product_id} className="border-b border-gray-200">
                <td className="py-3">{item.description}</td>
                <td className="py-3 text-right">{item.quantity}</td>
                <td className="py-3 text-right">{item.unit_price.toLocaleString()} Kz</td>
                <td className="py-3 text-right">{item.subtotal.toLocaleString()} Kz</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end">
          <div className="w-64 space-y-2">
            <div className="flex justify-between">
              <span>Total Peças:</span>
              <span>{totalParts.toLocaleString()} Kz</span>
            </div>
            <div className="flex justify-between">
              <span>Mão de Obra ({laborHours}h):</span>
              <span>{totalLabor.toLocaleString()} Kz</span>
            </div>
            <div className="flex justify-between border-t-2 border-black pt-2 font-bold text-xl">
              <span>TOTAL:</span>
              <span>{grandTotal.toLocaleString()} Kz</span>
            </div>
          </div>
        </div>

        <div className="mt-24 grid grid-cols-2 gap-12 text-center">
          <div className="border-t border-black pt-4">
            <p className="text-sm">Assinatura Responsável</p>
          </div>
          <div className="border-t border-black pt-4">
            <p className="text-sm">Assinatura Cliente</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic">
            Folha <span className="text-orange-500">de Obra</span>
          </h1>
          <p className="text-slate-500 text-xs font-mono uppercase tracking-[0.3em] mt-2">Gestão de Serviços e Materiais</p>
        </div>
        
        <div className="flex gap-2 bg-slate-800/50 p-1 rounded-2xl border border-slate-700 w-full md:w-auto overflow-x-auto">
          {SECTIONS.map(section => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={cn(
                'px-6 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap',
                activeSection === section 
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' 
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              )}
            >
              {section === 'Mecânica' && <Wrench className="w-4 h-4" />}
              {section === 'Pintura' && <Paintbrush className="w-4 h-4" />}
              {section === 'Estação' && <Droplets className="w-4 h-4" />}
              {section}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-8">
          <Card 
            title="Detalhes da Obra" 
            icon={
              <div className="flex gap-2 bg-slate-900 p-1 rounded-xl">
                {(['pvp1', 'pvp2', 'pvp3'] as const).map(level => (
                  <button
                    key={level}
                    onClick={() => setPriceLevel(level)}
                    className={cn(
                      'px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all',
                      priceLevel === level ? 'bg-orange-500 text-white' : 'text-slate-500'
                    )}
                  >
                    {level}
                  </button>
                ))}
              </div>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input 
                label="Cliente"
                value={client_name}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Nome Completo"
              />
              <Input 
                label="Matrícula"
                value={vehicle_plate}
                onChange={(e) => setVehiclePlate(e.target.value)}
                placeholder="LD-00-00-XX"
              />
            </div>

            <div className="mt-8 space-y-4">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Adicionar Materiais (ROWE OIL)</label>
              <div className="relative">
                <div className="relative">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input 
                    type="text" 
                    placeholder="Pesquisar por nome ou código..."
                    value={searchTerm}
                    onFocus={() => setIsDropdownOpen(true)}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setIsDropdownOpen(true);
                    }}
                    className="w-full bg-slate-900 border border-slate-700 rounded-2xl pl-14 pr-5 py-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
                  />
                </div>

                {isDropdownOpen && (
                  <div className="absolute z-50 w-full mt-2 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl max-h-64 overflow-y-auto">
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map(product => (
                        <button
                          key={product.id}
                          onClick={() => addItem(product)}
                          className="w-full text-left px-6 py-4 hover:bg-slate-700/50 transition-colors flex justify-between items-center border-b border-slate-700/50 last:border-0"
                        >
                          <div>
                            <p className="font-bold text-white">{product.name}</p>
                            <p className="text-[10px] text-slate-500 font-mono">{product.id} • {product.category}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-orange-400 font-bold">{(product.prices[priceLevel] || product.prices.pvp1).toLocaleString()} Kz</p>
                            <p className={cn(
                              'text-[10px]',
                              product.stock_current < (product.min_stock_alert || 5) ? 'text-red-400' : 'text-slate-500'
                            )}>
                              Stock: {product.stock_current} {product.unit}
                            </p>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="px-6 py-4 text-slate-500 text-sm italic">Nenhum produto encontrado.</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Selected Items Table */}
          <Card title="Materiais Selecionados" icon={<span className="bg-slate-900 px-4 py-1 rounded-full text-[10px] font-mono text-slate-500">{selectedItems.length} itens</span>}>
            <div className="overflow-x-auto -mx-6">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900/50 text-slate-500 text-[10px] uppercase tracking-widest">
                    <th className="px-8 py-4">Item</th>
                    <th className="px-8 py-4 text-center">Quantidade</th>
                    <th className="px-8 py-4 text-right">Preço</th>
                    <th className="px-8 py-4 text-right">Subtotal</th>
                    <th className="px-8 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {selectedItems.map(item => (
                    <tr key={item.product_id} className="group hover:bg-slate-700/20 transition-colors">
                      <td className="px-8 py-6">
                        <p className="font-bold text-white">{item.description}</p>
                        <p className="text-[10px] text-slate-500 font-mono">{item.product_id}</p>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center justify-center gap-3">
                          <button 
                            onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                            className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center hover:bg-slate-700 transition-colors"
                          >-</button>
                          <span className="w-8 text-center font-mono">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                            className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center hover:bg-slate-700 transition-colors"
                          >+</button>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right font-mono text-slate-400">
                        {item.unit_price.toLocaleString()} Kz
                      </td>
                      <td className="px-8 py-6 text-right font-bold text-orange-400">
                        {item.subtotal.toLocaleString()} Kz
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button 
                          onClick={() => removeItem(item.product_id)}
                          className="text-slate-600 hover:text-red-400 transition-colors p-2"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {selectedItems.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-8 py-12 text-center text-slate-500 italic">
                        Nenhum material adicionado. Use a pesquisa acima.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Summary Sidebar */}
        <div className="space-y-8">
          <Card title="Resumo de Custos">
            <div className="space-y-6">
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-sm">Total Peças</span>
                <span className="font-mono">{totalParts.toLocaleString()} Kz</span>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center text-slate-400">
                  <span className="text-sm flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Mão de Obra ({laborHours}h)
                  </span>
                  <span className="font-mono">{totalLabor.toLocaleString()} Kz</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input 
                    label="Horas"
                    type="number" 
                    value={laborHours}
                    onChange={(e) => setLaborHours(parseFloat(e.target.value) || 0)}
                  />
                  <Input 
                    label="Taxa/h"
                    type="number" 
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-slate-700">
                <div className="flex justify-between items-end mb-8">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Total Geral</span>
                  <span className="text-4xl font-black text-white tracking-tighter">
                    {grandTotal.toLocaleString()} <span className="text-lg text-orange-500">Kz</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <Button 
                    variant="secondary"
                    onClick={handlePrint}
                    className="w-full"
                  >
                    <Printer className="w-5 h-5" />
                    Gerar Orçamento
                  </Button>
                  <Button 
                    onClick={handleFinishWork}
                    className="w-full py-5"
                  >
                    <CheckCircle2 className="w-6 h-6" />
                    Finalizar Obra
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          <div className="bg-orange-500/10 border border-orange-500/20 rounded-3xl p-6">
            <p className="text-[10px] text-orange-400 leading-relaxed">
              <span className="font-bold block mb-1 uppercase tracking-widest">Dica do Sistema</span>
              O stock é abatido automaticamente ao finalizar a obra. Certifique-se de que as quantidades estão corretas antes de confirmar.
            </p>
          </div>
        </div>
      </div>

      <StockAlert products={products.length > 0 ? products : SEED_DATA} />

      {/* Dropdown Backdrop */}
      {isDropdownOpen && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </div>
  );
}
