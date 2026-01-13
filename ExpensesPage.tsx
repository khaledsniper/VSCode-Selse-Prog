import { useState } from "react";
import { useData, Expense } from "@/contexts/DataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, Plus, Edit2 } from "lucide-react";
import { formatCurrency, formatDateArabic } from "@/lib/utils";
import { toast } from "sonner";

/**
 * ExpensesPage Component
 * Design: Neumorphic cards with expense tracking
 * Features: Add, edit, delete expenses with categories
 */
export default function ExpensesPage() {
  const { expenses, addExpense, updateExpense, deleteExpense } = useData();
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [formData, setFormData] = useState<Omit<Expense, "id">>({
    description: "",
    amount: 0,
    category: "أخرى",
    date: new Date().toISOString().split("T")[0],
  });

  const categories = [
    "إيجار",
    "رواتب",
    "مواد خام",
    "كهرباء وماء",
    "صيانة",
    "نقل",
    "إعلان",
    "أخرى",
  ];

  const handleOpenDialog = (expense?: Expense) => {
    if (expense) {
      setEditingId(expense.id);
      setFormData({
        description: expense.description,
        amount: expense.amount,
        category: expense.category,
        date: expense.date,
        invoiceNumber: expense.invoiceNumber,
      });
    } else {
      setEditingId(null);
      setFormData({
        description: "",
        amount: 0,
        category: "أخرى",
        date: new Date().toISOString().split("T")[0],
      });
    }
    setIsOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.description || formData.amount <= 0) {
      toast.error("يرجى ملء جميع الحقول بشكل صحيح");
      return;
    }

    if (editingId) {
      updateExpense(editingId, formData);
      toast.success("تم تحديث المصروف بنجاح");
    } else {
      addExpense(formData);
      toast.success("تم إضافة مصروف جديد");
    }

    setIsOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("هل تريد حذف هذا المصروف؟")) {
      deleteExpense(id);
      toast.success("تم حذف المصروف");
    }
  };

  // Filter expenses
  let filteredExpenses = expenses.filter((expense) =>
    expense.description.includes(searchTerm)
  );

  if (filterCategory !== "all") {
    filteredExpenses = filteredExpenses.filter(
      (expense) => expense.category === filterCategory
    );
  }

  // Calculate totals
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const categoryTotals = categories.reduce(
    (acc, category) => {
      acc[category] = expenses
        .filter((expense) => expense.category === category)
        .reduce((sum, expense) => sum + expense.amount, 0);
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">المصروفات</h1>
          <p className="text-muted-foreground mt-1">
            إدارة مصروفات المكتب
          </p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => handleOpenDialog()}
              className="neumorphic-btn bg-primary text-primary-foreground gap-2"
            >
              <Plus size={20} />
              إضافة مصروف
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingId ? "تعديل المصروف" : "إضافة مصروف جديد"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  البيان *
                </label>
                <Input
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: e.target.value,
                    })
                  }
                  placeholder="أدخل وصف المصروف"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  الفئة
                </label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  المبلغ (ج.م) *
                </label>
                <Input
                  type="number"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      amount: parseFloat(e.target.value) || 0,
                    })
                  }
                  step="0.01"
                  min="0"
                  placeholder="أدخل المبلغ"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  رقم الفاتورة (اختياري)
                </label>
                <Input
                  value={formData.invoiceNumber || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      invoiceNumber: e.target.value,
                    })
                  }
                  placeholder="أدخل رقم الفاتورة"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  التاريخ
                </label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                />
              </div>

              <Button
                type="submit"
                className="w-full neumorphic-btn bg-primary text-primary-foreground"
              >
                {editingId ? "تحديث" : "إضافة"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Total Expenses Card */}
      <Card className="neumorphic-card p-6 bg-gradient-to-br from-warning/5 to-warning/10">
        <p className="text-sm text-muted-foreground mb-1">إجمالي المصروفات</p>
        <p className="text-3xl font-bold text-foreground">
          {formatCurrency(totalExpenses)}
        </p>
      </Card>

      {/* Category Breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {categories.map((category) => (
          <Card key={category} className="neumorphic-card p-4 text-center">
            <p className="text-xs text-muted-foreground mb-2">{category}</p>
            <p className="font-bold text-foreground">
              {formatCurrency(categoryTotals[category] || 0)}
            </p>
          </Card>
        ))}
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 flex-col md:flex-row">
        <Input
          placeholder="ابحث عن مصروف..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="neumorphic-input flex-1"
        />
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الفئات</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Expenses List */}
      <div className="space-y-3">
        {filteredExpenses.length === 0 ? (
          <Card className="neumorphic-card p-8 text-center">
            <p className="text-muted-foreground">لا توجد مصروفات</p>
          </Card>
        ) : (
          filteredExpenses.map((expense) => (
            <Card key={expense.id} className="neumorphic-card p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-bold text-foreground">
                    {expense.description}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {expense.category} • {formatDateArabic(new Date(expense.date))}
                  </p>
                  {expense.invoiceNumber && (
                    <p className="text-xs text-muted-foreground">
                      الفاتورة: {expense.invoiceNumber}
                    </p>
                  )}
                </div>
                <div className="text-right mr-4">
                  <p className="font-bold text-warning">
                    {formatCurrency(expense.amount)}
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    onClick={() => handleOpenDialog(expense)}
                    size="sm"
                    variant="outline"
                  >
                    <Edit2 size={16} />
                  </Button>
                  <Button
                    onClick={() => handleDelete(expense.id)}
                    size="sm"
                    variant="outline"
                    className="text-destructive"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
