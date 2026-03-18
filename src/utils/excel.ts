import * as XLSX from 'xlsx';
import { Product } from '@/types';

export const exportInventoryToExcel = (products: Product[]) => {
  const data = products.map((p) => ({
    'Código (SKU)': p.id,
    'Nome do Produto': p.name,
    Categoria: p.category,
    Marca: p.brand,
    'Stock Atual': p.stock_current,
    'Stock Físico (Preencher)': '', // Blank column for physical inventory
    Unidade: p.unit,
    'PVP 1': p.prices?.pvp1 || 0,
    'PVP 2': p.prices?.pvp2 || 0,
    'PVP 3': p.prices?.pvp3 || 0,
    'Alerta Stock Mínimo': p.min_stock_alert || 0,
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Inventário Físico');

  // Auto-size columns
  const colWidths = [
    { wch: 15 }, // SKU
    { wch: 40 }, // Nome
    { wch: 20 }, // Categoria
    { wch: 15 }, // Marca
    { wch: 15 }, // Stock Atual
    { wch: 25 }, // Stock Físico
    { wch: 10 }, // Unidade
    { wch: 15 }, // PVP 1
    { wch: 15 }, // PVP 2
    { wch: 15 }, // PVP 3
    { wch: 20 }, // Alerta
  ];
  ws['!cols'] = colWidths;

  XLSX.writeFile(wb, `Inventario_${new Date().toISOString().split('T')[0]}.xlsx`);
};

export const parseExcelToProducts = async (file: File): Promise<Partial<Product>[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);

        const products = json.map((row: any) => ({
          id: row['Código (SKU)']?.toString() || '',
          name: row['Nome do Produto'] || '',
          category: row['Categoria'] || '',
          brand: row['Marca'] || '',
          stock_current: Number(row['Stock Físico (Preencher)']) || Number(row['Stock Atual']) || 0,
          unit: row['Unidade'] || 'un',
          prices: {
            pvp1: Number(row['PVP 1']) || 0,
            pvp2: Number(row['PVP 2']) || 0,
            pvp3: Number(row['PVP 3']) || 0,
          },
          min_stock_alert: Number(row['Alerta Stock Mínimo']) || 5,
        }));

        resolve(products.filter((p) => p.id && p.name)); // Only return valid rows
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};
