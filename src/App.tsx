import { useAppStore } from '@/store';
import { Header } from '@/components/Header';
import { Dashboard } from '@/pages/Dashboard';
import { Inventory } from '@/pages/Inventory';
import WorkOrderPage from '@/pages/WorkOrder';
import { History } from '@/pages/History';

export default function App() {
  const { activeTab } = useAppStore();

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'inventory':
        return <Inventory />;
      case 'work-order':
        return <WorkOrderPage />;
      case 'history':
        return <History />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-orange-500/30">
      <Header />

      <main className="max-w-7xl mx-auto px-4 md:px-8 pt-24 pb-12">{renderContent()}</main>
    </div>
  );
}
