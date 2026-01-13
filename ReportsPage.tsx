import { useData } from "@/contexts/DataContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText, Download, Printer } from "lucide-react";
import { formatCurrency, formatDateArabic, toArabicNumerals } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";

/**
 * ReportsPage Component
 * Design: Neumorphic cards with printable reports
 * Features: Monthly reports for sales, expenses, debts, and profit/loss
 */
export default function ReportsPage() {
  const { sales, debts, expenses } = useData();
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().getMonth() + 1
  );
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const months = [
    "يناير",
    "فبراير",
    "مارس",
    "أبريل",
    "مايو",
    "يونيو",
    "يوليو",
    "أغسطس",
    "سبتمبر",
    "أكتوبر",
    "نوفمبر",
    "ديسمبر",
  ];

  const years = Array.from(
    { length: 5 },
    (_, i) => new Date().getFullYear() - i
  );

  // Filter data by month and year
  const filterByMonth = (date: string) => {
    const d = new Date(date);
    return d.getMonth() + 1 === selectedMonth && d.getFullYear() === selectedYear;
  };

  const monthlySales = sales.filter((sale) => filterByMonth(sale.date));
  const monthlyDebts = debts.filter((debt) => filterByMonth(debt.date));
  const monthlyExpenses = expenses.filter((expense) =>
    filterByMonth(expense.date)
  );

  // Calculate totals
  const totalRevenue = monthlySales.reduce((sum, sale) => sum + sale.revenue, 0);
  const totalMaterials = monthlySales.reduce(
    (sum, sale) => sum + sale.materials,
    0
  );
  const totalSalesExpenses = monthlySales.reduce(
    (sum, sale) => sum + sale.expenses,
    0
  );
  const totalProfit = monthlySales.reduce((sum, sale) => sum + sale.netProfit, 0);
  const totalOperatingExpenses = monthlyExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );
  const netProfit = totalProfit - totalOperatingExpenses;
  const totalDebtsAmount = monthlyDebts.reduce((sum, debt) => sum + debt.amount, 0);
  const paidDebts = monthlyDebts
    .filter((debt) => debt.isPaid)
    .reduce((sum, debt) => sum + debt.amount, 0);
  const unpaidDebts = monthlyDebts
    .filter((debt) => !debt.isPaid)
    .reduce((sum, debt) => sum + debt.amount, 0);

  const handlePrint = () => {
    window.print();
    toast.success("جاري فتح نافذة الطباعة");
  };

  const handleExport = () => {
    const reportData = {
      month: months[selectedMonth - 1],
      year: selectedYear,
      salesReport: {
        totalRevenue,
        totalMaterials,
        totalSalesExpenses,
        totalProfit,
        salesCount: monthlySales.length,
      },
      expensesReport: {
        totalOperatingExpenses,
        expensesCount: monthlyExpenses.length,
      },
      debtsReport: {
        totalDebts: totalDebtsAmount,
        paidDebts,
        unpaidDebts,
        debtsCount: monthlyDebts.length,
      },
      profitLoss: {
        grossProfit: totalProfit,
        operatingExpenses: totalOperatingExpenses,
        netProfit,
      },
    };

    const jsonString = JSON.stringify(reportData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `تقرير-${months[selectedMonth - 1]}-${selectedYear}.json`;
    link.click();
    toast.success("تم تصدير التقرير");
  };

  return (
    <div className="space-y-6 print:space-y-4">
      {/* Header */}
      <div className="print:hidden">
        <h1 className="text-3xl font-bold text-foreground">التقارير</h1>
        <p className="text-muted-foreground mt-1">
          تقارير شاملة عن أداء المكتب
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-4 flex-col md:flex-row print:hidden">
        <Select
          value={String(selectedMonth)}
          onValueChange={(value) => setSelectedMonth(parseInt(value))}
        >
          <SelectTrigger className="w-full md:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {months.map((month, index) => (
              <SelectItem key={month} value={String(index + 1)}>
                {month}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={String(selectedYear)}
          onValueChange={(value) => setSelectedYear(parseInt(value))}
        >
          <SelectTrigger className="w-full md:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year} value={String(year)}>
                {toArabicNumerals(year)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          onClick={handlePrint}
          className="neumorphic-btn bg-primary text-primary-foreground gap-2"
        >
          <Printer size={18} />
          طباعة
        </Button>

        <Button
          onClick={handleExport}
          variant="outline"
          className="neumorphic-btn gap-2"
        >
          <Download size={18} />
          تصدير
        </Button>
      </div>

      {/* Report Title */}
      <div className="text-center py-6 print:py-4 border-b border-border">
        <h2 className="text-2xl font-bold text-foreground">
          تقرير شهري شامل
        </h2>
        <p className="text-muted-foreground">
          {months[selectedMonth - 1]} {toArabicNumerals(selectedYear)}
        </p>
      </div>

      {/* Sales Report */}
      <Card className="neumorphic-card p-6 print:shadow-none print:border">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-info" />
          <h3 className="text-lg font-bold text-foreground">تقرير المبيعات</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="p-4 bg-secondary rounded-lg">
            <p className="text-sm text-muted-foreground">عدد المبيعات</p>
            <p className="text-2xl font-bold text-foreground">
              {toArabicNumerals(monthlySales.length)}
            </p>
          </div>
          <div className="p-4 bg-secondary rounded-lg">
            <p className="text-sm text-muted-foreground">إجمالي الإيراد</p>
            <p className="text-2xl font-bold text-info">
              {formatCurrency(totalRevenue)}
            </p>
          </div>
          <div className="p-4 bg-secondary rounded-lg">
            <p className="text-sm text-muted-foreground">الخامات</p>
            <p className="text-2xl font-bold text-warning">
              {formatCurrency(totalMaterials)}
            </p>
          </div>
          <div className="p-4 bg-secondary rounded-lg">
            <p className="text-sm text-muted-foreground">مصروفات المبيعات</p>
            <p className="text-2xl font-bold text-warning">
              {formatCurrency(totalSalesExpenses)}
            </p>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg col-span-2 md:col-span-1">
            <p className="text-sm text-muted-foreground">إجمالي الأرباح</p>
            <p className="text-2xl font-bold text-success">
              {formatCurrency(totalProfit)}
            </p>
          </div>
        </div>
      </Card>

      {/* Expenses Report */}
      <Card className="neumorphic-card p-6 print:shadow-none print:border">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-warning" />
          <h3 className="text-lg font-bold text-foreground">تقرير المصروفات</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="p-4 bg-secondary rounded-lg">
            <p className="text-sm text-muted-foreground">عدد المصروفات</p>
            <p className="text-2xl font-bold text-foreground">
              {toArabicNumerals(monthlyExpenses.length)}
            </p>
          </div>
          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg col-span-2 md:col-span-2">
            <p className="text-sm text-muted-foreground">إجمالي المصروفات</p>
            <p className="text-2xl font-bold text-warning">
              {formatCurrency(totalOperatingExpenses)}
            </p>
          </div>
        </div>

        {/* Expenses Breakdown */}
        {monthlyExpenses.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border">
            <p className="font-medium text-foreground mb-3">تفاصيل المصروفات:</p>
            <div className="space-y-2">
              {monthlyExpenses.map((expense) => (
                <div key={expense.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {expense.description} ({expense.category})
                  </span>
                  <span className="font-medium">
                    {formatCurrency(expense.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Debts Report */}
      <Card className="neumorphic-card p-6 print:shadow-none print:border">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-danger" />
          <h3 className="text-lg font-bold text-foreground">تقرير الديون</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="p-4 bg-secondary rounded-lg">
            <p className="text-sm text-muted-foreground">عدد الديون</p>
            <p className="text-2xl font-bold text-foreground">
              {toArabicNumerals(monthlyDebts.length)}
            </p>
          </div>
          <div className="p-4 bg-secondary rounded-lg">
            <p className="text-sm text-muted-foreground">إجمالي الديون</p>
            <p className="text-2xl font-bold text-danger">
              {formatCurrency(totalDebtsAmount)}
            </p>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-sm text-muted-foreground">المدفوع</p>
            <p className="text-2xl font-bold text-success">
              {formatCurrency(paidDebts)}
            </p>
          </div>
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg col-span-2 md:col-span-1">
            <p className="text-sm text-muted-foreground">المتبقي</p>
            <p className="text-2xl font-bold text-danger">
              {formatCurrency(unpaidDebts)}
            </p>
          </div>
        </div>
      </Card>

      {/* Profit & Loss Report */}
      <Card className="neumorphic-card p-6 print:shadow-none print:border bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-bold text-foreground">
            بيان الأرباح والخسائر
          </h3>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-secondary rounded-lg">
            <span className="text-foreground font-medium">إجمالي الأرباح من المبيعات</span>
            <span className="text-lg font-bold text-success">
              {formatCurrency(totalProfit)}
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-secondary rounded-lg">
            <span className="text-foreground font-medium">مجموع المصروفات التشغيلية</span>
            <span className="text-lg font-bold text-warning">
              -{formatCurrency(totalOperatingExpenses)}
            </span>
          </div>
          <div className="flex justify-between items-center p-4 bg-primary/10 rounded-lg border-2 border-primary">
            <span className="text-foreground font-bold">صافي الربح</span>
            <span
              className={`text-2xl font-bold ${
                netProfit >= 0 ? "text-success" : "text-danger"
              }`}
            >
              {formatCurrency(netProfit)}
            </span>
          </div>
        </div>
      </Card>

      {/* Footer */}
      <div className="text-center pt-6 border-t border-border text-sm text-muted-foreground print:pt-4">
        <p>تم إنشاء هذا التقرير بواسطة نظام إدارة مكتب الدعاية والإعلان</p>
        <p>{formatDateArabic(new Date())}</p>
      </div>
    </div>
  );
}
