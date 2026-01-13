import React, { createContext, useContext, useState, useEffect } from "react";
import { getFromLocalStorage, saveToLocalStorage } from "@/lib/utils";

export interface Sale {
  id: string;
  designType: string;
  customerName: string;
  customerPhone: string;
  quantity: number;
  revenue: number;
  materials: number;
  expenses: number;
  netProfit: number;
  paymentMethod: "cash" | "credit";
  date: string;
  image?: string;
}

export interface Debt {
  id: string;
  customerName: string;
  customerPhone: string;
  amount: number;
  date: string;
  isPaid: boolean;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  invoiceNumber?: string;
}

export interface Settings {
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyLogo?: string;
  currency: string;
}

interface DataContextType {
  // Sales
  sales: Sale[];
  addSale: (sale: Omit<Sale, "id">) => void;
  updateSale: (id: string, sale: Partial<Sale>) => void;
  deleteSale: (id: string) => void;

  // Debts
  debts: Debt[];
  addDebt: (debt: Omit<Debt, "id">) => void;
  updateDebt: (id: string, debt: Partial<Debt>) => void;
  deleteDebt: (id: string) => void;
  markDebtAsPaid: (id: string) => void;

  // Expenses
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, "id">) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;

  // Settings
  settings: Settings;
  updateSettings: (settings: Partial<Settings>) => void;

  // Utilities
  clearAllData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const DEFAULT_SETTINGS: Settings = {
  companyName: "مكتب الدعاية والإعلان",
  companyAddress: "",
  companyPhone: "",
  currency: "ج.م",
};

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [sales, setSales] = useState<Sale[]>([]);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  // Load data from localStorage on mount
  useEffect(() => {
    const loadedSales = getFromLocalStorage<Sale[]>("sales", []);
    const loadedDebts = getFromLocalStorage<Debt[]>("debts", []);
    const loadedExpenses = getFromLocalStorage<Expense[]>("expenses", []);
    const loadedSettings = getFromLocalStorage<Settings>(
      "settings",
      DEFAULT_SETTINGS
    );

    setSales(loadedSales || []);
    setDebts(loadedDebts || []);
    setExpenses(loadedExpenses || []);
    setSettings(loadedSettings || DEFAULT_SETTINGS);
  }, []);

  // Save sales to localStorage
  useEffect(() => {
    saveToLocalStorage("sales", sales);
  }, [sales]);

  // Save debts to localStorage
  useEffect(() => {
    saveToLocalStorage("debts", debts);
  }, [debts]);

  // Save expenses to localStorage
  useEffect(() => {
    saveToLocalStorage("expenses", expenses);
  }, [expenses]);

  // Save settings to localStorage
  useEffect(() => {
    saveToLocalStorage("settings", settings);
  }, [settings]);

  // ==================== Sales Methods ====================

  const addSale = (sale: Omit<Sale, "id">) => {
    const newSale: Sale = {
      ...sale,
      id: Math.random().toString(36).substring(2),
    };
    setSales([...sales, newSale]);
  };

  const updateSale = (id: string, saleUpdate: Partial<Sale>) => {
    setSales(
      sales.map((sale) =>
        sale.id === id ? { ...sale, ...saleUpdate } : sale
      )
    );
  };

  const deleteSale = (id: string) => {
    setSales(sales.filter((sale) => sale.id !== id));
  };

  // ==================== Debts Methods ====================

  const addDebt = (debt: Omit<Debt, "id">) => {
    const newDebt: Debt = {
      ...debt,
      id: Math.random().toString(36).substring(2),
    };
    setDebts([...debts, newDebt]);
  };

  const updateDebt = (id: string, debtUpdate: Partial<Debt>) => {
    setDebts(
      debts.map((debt) =>
        debt.id === id ? { ...debt, ...debtUpdate } : debt
      )
    );
  };

  const deleteDebt = (id: string) => {
    setDebts(debts.filter((debt) => debt.id !== id));
  };

  const markDebtAsPaid = (id: string) => {
    updateDebt(id, { isPaid: true });
  };

  // ==================== Expenses Methods ====================

  const addExpense = (expense: Omit<Expense, "id">) => {
    const newExpense: Expense = {
      ...expense,
      id: Math.random().toString(36).substring(2),
    };
    setExpenses([...expenses, newExpense]);
  };

  const updateExpense = (id: string, expenseUpdate: Partial<Expense>) => {
    setExpenses(
      expenses.map((expense) =>
        expense.id === id ? { ...expense, ...expenseUpdate } : expense
      )
    );
  };

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter((expense) => expense.id !== id));
  };

  // ==================== Settings Methods ====================

  const updateSettings = (settingsUpdate: Partial<Settings>) => {
    setSettings({ ...settings, ...settingsUpdate });
  };

  // ==================== Utilities ====================

  const clearAllData = () => {
    setSales([]);
    setDebts([]);
    setExpenses([]);
    setSettings(DEFAULT_SETTINGS);
  };

  return (
    <DataContext.Provider
      value={{
        sales,
        addSale,
        updateSale,
        deleteSale,
        debts,
        addDebt,
        updateDebt,
        deleteDebt,
        markDebtAsPaid,
        expenses,
        addExpense,
        updateExpense,
        deleteExpense,
        settings,
        updateSettings,
        clearAllData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within DataProvider");
  }
  return context;
}
