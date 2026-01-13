import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ==================== Encryption & Password ====================

/**
 * Simple password hashing using SHA-256
 */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
}

/**
 * Verify password against hash
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
}

// ==================== Arabic Numerals ====================

const arabicNumerals = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
const englishNumerals = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

export function toArabicNumerals(num: string | number): string {
  const str = String(num);
  return str.replace(/\d/g, (digit) => arabicNumerals[parseInt(digit)]);
}

export function toEnglishNumerals(str: string): string {
  let result = str;
  arabicNumerals.forEach((arabic, index) => {
    result = result.replace(new RegExp(arabic, "g"), englishNumerals[index]);
  });
  return result;
}

// ==================== Date Formatting ====================

/**
 * Format date to Arabic format (DD/MM/YYYY)
 */
export function formatDateArabic(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${toArabicNumerals(day)}/${toArabicNumerals(month)}/${toArabicNumerals(year)}`;
}

/**
 * Format date to Hijri calendar
 */
export function formatDateHijri(date: Date): string {
  // Simplified Hijri conversion (approximate)
  const jd = Math.floor(
    date.getTime() / 86400000 - date.getTimezoneOffset() / 1440 + 1948440.5
  );
  const l = jd + 68569;
  const n = Math.floor((4 * l) / 146097);
  const l2 = l - Math.floor((146097 * n + 3) / 4);
  const i = Math.floor((4000 * (l2 + 1)) / 1461001);
  const l3 = l2 - Math.floor((1461 * i) / 4) + 31;
  const j = Math.floor((80 * l3) / 2447);
  const day = l3 - Math.floor((2447 * j) / 80);
  const l4 = Math.floor(j / 11);
  const month = j + 2 - 12 * l4;
  const year = 100 * (n - 49) + i + l4;

  return `${toArabicNumerals(day)}/${toArabicNumerals(month)}/${toArabicNumerals(year)}`;
}

// ==================== Currency Formatting ====================

export function formatCurrency(amount: number): string {
  return `${toArabicNumerals(amount.toFixed(2))} ج.م`;
}

export function parseCurrency(str: string): number {
  const cleaned = toEnglishNumerals(str.replace(/[^\d.-]/g, ""));
  return parseFloat(cleaned) || 0;
}

// ==================== Data Validation ====================

export function isValidPhone(phone: string): boolean {
  const cleaned = toEnglishNumerals(phone.replace(/\D/g, ""));
  return cleaned.length >= 10 && cleaned.length <= 15;
}

export function isValidEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// ==================== Calculations ====================

export function calculateProfit(
  revenue: number,
  materials: number,
  expenses: number
): number {
  return revenue - materials - expenses;
}

export function calculateTotalDebt(debts: Array<{ amount: number }>): number {
  return debts.reduce((sum, debt) => sum + debt.amount, 0);
}

export function calculateTotalSales(
  sales: Array<{ netProfit: number }>
): number {
  return sales.reduce((sum, sale) => sum + sale.netProfit, 0);
}

export function calculateTotalExpenses(
  expenses: Array<{ amount: number }>
): number {
  return expenses.reduce((sum, expense) => sum + expense.amount, 0);
}

// ==================== Data Export ====================

export function exportToJSON(data: unknown): string {
  return JSON.stringify(data, null, 2);
}

export function exportToCSV(data: Array<Record<string, unknown>>): string {
  if (data.length === 0) return "";

  const headers = Object.keys(data[0]);
  const csvHeaders = headers.join(",");
  const csvRows = data
    .map((row) =>
      headers
        .map((header) => {
          const value = row[header];
          if (typeof value === "string" && value.includes(",")) {
            return `"${value}"`;
          }
          return value;
        })
        .join(",")
    )
    .join("\n");

  return `${csvHeaders}\n${csvRows}`;
}

// ==================== Local Storage ====================

export function saveToLocalStorage(key: string, data: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error("Failed to save to localStorage:", error);
  }
}

export function getFromLocalStorage<T>(key: string, defaultValue?: T): T | null {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue || null;
  } catch (error) {
    console.error("Failed to get from localStorage:", error);
    return defaultValue || null;
  }
}

export function removeFromLocalStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error("Failed to remove from localStorage:", error);
  }
}

export function clearLocalStorage(): void {
  try {
    localStorage.clear();
  } catch (error) {
    console.error("Failed to clear localStorage:", error);
  }
}

// ==================== Backup & Restore ====================

export function createBackup(): string {
  const backup = {
    timestamp: new Date().toISOString(),
    data: {
      sales: getFromLocalStorage("sales", []),
      debts: getFromLocalStorage("debts", []),
      expenses: getFromLocalStorage("expenses", []),
      settings: getFromLocalStorage("settings", {}),
    },
  };
  return JSON.stringify(backup, null, 2);
}

export function restoreFromBackup(backupData: string): boolean {
  try {
    const backup = JSON.parse(backupData);
    if (backup.data) {
      saveToLocalStorage("sales", backup.data.sales || []);
      saveToLocalStorage("debts", backup.data.debts || []);
      saveToLocalStorage("expenses", backup.data.expenses || []);
      saveToLocalStorage("settings", backup.data.settings || {});
      return true;
    }
    return false;
  } catch (error) {
    console.error("Failed to restore backup:", error);
    return false;
  }
}

// ==================== Search & Filter ====================

export function searchInArray<T>(
  array: T[],
  searchTerm: string,
  searchFields: (keyof T)[]
): T[] {
  if (!searchTerm.trim()) return array;

  const lowerSearchTerm = searchTerm.toLowerCase();
  return array.filter((item) =>
    searchFields.some((field) => {
      const value = String(item[field]).toLowerCase();
      return value.includes(lowerSearchTerm);
    })
  );
}

export function sortArray<T>(
  array: T[],
  field: keyof T,
  order: "asc" | "desc" = "asc"
): T[] {
  return [...array].sort((a, b) => {
    const aValue = a[field];
    const bValue = b[field];

    if (aValue < bValue) return order === "asc" ? -1 : 1;
    if (aValue > bValue) return order === "asc" ? 1 : -1;
    return 0;
  });
}

// ==================== Notifications ====================

export function showNotification(
  message: string,
  type: "success" | "error" | "info" | "warning" = "info"
): void {
  console.log(`[${type.toUpperCase()}] ${message}`);
}
