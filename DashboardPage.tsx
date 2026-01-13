import { useData } from "@/contexts/DataContext";
import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  ShoppingCart,
  CreditCard,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { formatCurrency, toArabicNumerals } from "@/lib/utils";

/**
 * DashboardPage Component
 * Design: Neumorphic cards with charts and statistics
 * Features: Sales, debts, expenses overview and monthly trends
 */
export default function DashboardPage() {
  const { sales, debts, expenses } = useData();

  // Calculate statistics
  const totalSales = sales.reduce((sum, sale) => sum + sale.revenue, 0);
  const totalProfit = sales.reduce((sum, sale) => sum + sale.netProfit, 0);
  const totalDebts = debts.reduce((sum, debt) => sum + debt.amount, 0);
  const unpaidDebts = debts
    .filter((debt) => !debt.isPaid)
    .reduce((sum, debt) => sum + debt.amount, 0);
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  // Monthly data for charts
  const monthlyData = generateMonthlyData(sales, expenses);
  const debtStatus = [
    { name: "مدفوعة", value: totalDebts - unpaidDebts },
    { name: "غير مدفوعة", value: unpaidDebts },
  ];

  const COLORS = ["#10b981", "#ef4444"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">لوحة التحكم</h1>
        <p className="text-muted-foreground mt-1">
          ملخص شامل لأداء المكتب
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Sales Card */}
        <Card className="neumorphic-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">إجمالي المبيعات</p>
              <p className="text-2xl font-bold text-foreground">
                {formatCurrency(totalSales)}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-info" />
            </div>
          </div>
        </Card>

        {/* Total Profit Card */}
        <Card className="neumorphic-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">إجمالي الأرباح</p>
              <p className="text-2xl font-bold text-foreground">
                {formatCurrency(totalProfit)}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-success" />
            </div>
          </div>
        </Card>

        {/* Total Debts Card */}
        <Card className="neumorphic-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">إجمالي الديون</p>
              <p className="text-2xl font-bold text-foreground">
                {formatCurrency(totalDebts)}
              </p>
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                غير مدفوع: {formatCurrency(unpaidDebts)}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-danger" />
            </div>
          </div>
        </Card>

        {/* Total Expenses Card */}
        <Card className="neumorphic-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">إجمالي المصروفات</p>
              <p className="text-2xl font-bold text-foreground">
                {formatCurrency(totalExpenses)}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-warning" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Sales & Expenses Chart */}
        <Card className="neumorphic-card p-6">
          <h2 className="text-lg font-bold text-foreground mb-4">
            المبيعات والمصروفات الشهرية
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: `1px solid var(--border)`,
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar dataKey="sales" name="المبيعات" fill="#3b82f6" />
              <Bar dataKey="expenses" name="المصروفات" fill="#f97316" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Debt Status Pie Chart */}
        <Card className="neumorphic-card p-6">
          <h2 className="text-lg font-bold text-foreground mb-4">
            حالة الديون
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={debtStatus}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${toArabicNumerals(entry.value)}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {COLORS.map((color, index) => (
                  <Cell key={`cell-${index}`} fill={color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: `1px solid var(--border)`,
                  borderRadius: "8px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="neumorphic-card p-6">
        <h2 className="text-lg font-bold text-foreground mb-4">
          آخر المعاملات
        </h2>
        <div className="space-y-3">
          {sales.slice(-5).reverse().map((sale) => (
            <div
              key={sale.id}
              className="flex items-center justify-between p-3 bg-secondary rounded-lg"
            >
              <div>
                <p className="font-medium text-foreground">{sale.customerName}</p>
                <p className="text-sm text-muted-foreground">{sale.designType}</p>
              </div>
              <p className="font-bold text-success">
                {formatCurrency(sale.netProfit)}
              </p>
            </div>
          ))}
          {sales.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              لا توجد معاملات حتى الآن
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}

// Helper function to generate monthly data
function generateMonthlyData(
  sales: any[],
  expenses: any[]
): Array<{ month: string; sales: number; expenses: number }> {
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

  const data = months.map((month, index) => {
    const monthNum = index + 1;
    const monthlySales = sales
      .filter((sale) => new Date(sale.date).getMonth() === index)
      .reduce((sum, sale) => sum + sale.revenue, 0);

    const monthlyExpenses = expenses
      .filter((expense) => new Date(expense.date).getMonth() === index)
      .reduce((sum, expense) => sum + expense.amount, 0);

    return {
      month,
      sales: monthlySales,
      expenses: monthlyExpenses,
    };
  });

  return data;
}
