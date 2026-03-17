export interface Product {
  id: string; // SKU/Código
  name: string;
  category: string;
  brand: string;
  stock_initial: number;
  stock_current: number;
  prices: {
    pvp1: number;
    pvp2: number;
    pvp3: number;
    pvp4?: number;
  };
  unit: string;
  min_stock_alert: number;
}

export interface WorkOrderItem {
  product_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface Labor {
  hours: number;
  hourly_rate: number;
  total_labor: number;
}

export type SectionType = 'Mecânica' | 'Pintura' | 'Estação';

export interface WorkOrderSection {
  type: SectionType;
  items: WorkOrderItem[];
  labor: Labor;
}

export type WorkOrderStatus = 'Orçamento' | 'Aberta' | 'Concluída';

export interface WorkOrder {
  order_id?: string;
  status: WorkOrderStatus;
  client_name: string;
  vehicle_plate: string;
  created_at: any; // Firebase Timestamp
  sections: WorkOrderSection[];
  total_amount: number;
  total_cost: number;
}

export interface Transaction {
  transaction_id?: string;
  product_id: string;
  type: 'Saída_Obra' | 'Entrada_Fornecedor';
  quantity: number;
  timestamp: any;
  reference_id: string;
}
