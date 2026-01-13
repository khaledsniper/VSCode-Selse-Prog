import { useState } from "react";
import { useData, Debt } from "@/contexts/DataContext";
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
import { Trash2, Plus, CheckCircle2, Circle } from "lucide-react";
import { formatCurrency, formatDateArabic } from "@/lib/utils";
import { toast } from "sonner";

/**
 * DebtsPage Component
 * Design: Neumorphic cards with debt tracking
 * Features: Add, edit, delete, mark as paid
 */
export default function DebtsPage() {
  const { debts, addDebt, updateDebt, deleteDebt, markDebtAsPaid } = useData();
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "paid" | "unpaid">(
    "all"
  );
  const [formData, setFormData] = useState<Omit<Debt, "id">>({
    customerName: "",
    customerPhone: "",
    amount: 0,
    date: new Date().toISOString().split("T")[0],
    isPaid: false,
  });

  const handleOpenDialog = (debt?: Debt) => {
    if (debt) {
      setEditingId(debt.id);
      setFormData({
        customerName: debt.customerName,
        customerPhone: debt.customerPhone,
        amount: debt.amount,
        date: debt.date,
        isPaid: debt.isPaid,
      });
    } else {
      setEditingId(null);
      setFormData({
        customerName: "",
        customerPhone: "",
        amount: 0,
        date: new Date().toISOString().split("T")[0],
        isPaid: false,
      });
    }
    setIsOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.customerName || !formData.customerPhone || formData.amount <= 0) {
      toast.error("يرجى ملء جميع الحقول بشكل صحيح");
      return;
    }

    if (editingId) {
      updateDebt(editingId, formData);
      toast.success("تم تحديث الدين بنجاح");
    } else {
      addDebt(formData);
      toast.success("تم إضافة دين جديد");
    }

    setIsOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("هل تريد حذف هذا الدين؟")) {
      deleteDebt(id);
      toast.success("تم حذف الدين");
    }
  };

  const handleMarkAsPaid = (id: string) => {
    markDebtAsPaid(id);
    toast.success("تم تحديث حالة الدين");
  };

  // Filter debts
  let filteredDebts = debts.filter(
    (debt) =>
      debt.customerName.includes(searchTerm) ||
      debt.customerPhone.includes(searchTerm)
  );

  if (filterStatus === "paid") {
    filteredDebts = filteredDebts.filter((debt) => debt.isPaid);
  } else if (filterStatus === "unpaid") {
    filteredDebts = filteredDebts.filter((debt) => !debt.isPaid);
  }

  // Calculate totals
  const totalDebts = debts.reduce((sum, debt) => sum + debt.amount, 0);
  const paidDebts = debts
    .filter((debt) => debt.isPaid)
    .reduce((sum, debt) => sum + debt.amount, 0);
  const unpaidDebts = debts
    .filter((debt) => !debt.isPaid)
    .reduce((sum, debt) => sum + debt.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">الديون</h1>
          <p className="text-muted-foreground mt-1">
            تتبع ديون العملاء والتحصيلات
          </p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => handleOpenDialog()}
              className="neumorphic-btn bg-primary text-primary-foreground gap-2"
            >
              <Plus size={20} />
              إضافة دين
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingId ? "تعديل الدين" : "إضافة دين جديد"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  اسم العميل *
                </label>
                <Input
                  value={formData.customerName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      customerName: e.target.value,
                    })
                  }
                  placeholder="أدخل اسم العميل"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  رقم الهاتف *
                </label>
                <Input
                  value={formData.customerPhone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      customerPhone: e.target.value,
                    })
                  }
                  placeholder="أدخل رقم الهاتف"
                />
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

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="neumorphic-card p-6">
          <p className="text-sm text-muted-foreground mb-1">إجمالي الديون</p>
          <p className="text-2xl font-bold text-foreground">
            {formatCurrency(totalDebts)}
          </p>
        </Card>
        <Card className="neumorphic-card p-6">
          <p className="text-sm text-muted-foreground mb-1">الديون المدفوعة</p>
          <p className="text-2xl font-bold text-success">
            {formatCurrency(paidDebts)}
          </p>
        </Card>
        <Card className="neumorphic-card p-6">
          <p className="text-sm text-muted-foreground mb-1">الديون المتبقية</p>
          <p className="text-2xl font-bold text-danger">
            {formatCurrency(unpaidDebts)}
          </p>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 flex-col md:flex-row">
        <Input
          placeholder="ابحث عن عميل أو رقم هاتف..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="neumorphic-input flex-1"
        />
        <div className="flex gap-2">
          <Button
            onClick={() => setFilterStatus("all")}
            variant={filterStatus === "all" ? "default" : "outline"}
            className="neumorphic-btn"
          >
            الكل
          </Button>
          <Button
            onClick={() => setFilterStatus("unpaid")}
            variant={filterStatus === "unpaid" ? "default" : "outline"}
            className="neumorphic-btn"
          >
            غير مدفوعة
          </Button>
          <Button
            onClick={() => setFilterStatus("paid")}
            variant={filterStatus === "paid" ? "default" : "outline"}
            className="neumorphic-btn"
          >
            مدفوعة
          </Button>
        </div>
      </div>

      {/* Debts List */}
      <div className="space-y-3">
        {filteredDebts.length === 0 ? (
          <Card className="neumorphic-card p-8 text-center">
            <p className="text-muted-foreground">لا توجد ديون</p>
          </Card>
        ) : (
          filteredDebts.map((debt) => (
            <Card key={debt.id} className="neumorphic-card p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <button
                    onClick={() => handleMarkAsPaid(debt.id)}
                    className="flex-shrink-0"
                  >
                    {debt.isPaid ? (
                      <CheckCircle2 className="w-6 h-6 text-success" />
                    ) : (
                      <Circle className="w-6 h-6 text-muted-foreground" />
                    )}
                  </button>
                  <div>
                    <p
                      className={`font-bold ${
                        debt.isPaid
                          ? "text-muted-foreground line-through"
                          : "text-foreground"
                      }`}
                    >
                      {debt.customerName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {debt.customerPhone} • {formatDateArabic(new Date(debt.date))}
                    </p>
                  </div>
                </div>
                <div className="text-right mr-4">
                  <p
                    className={`font-bold ${
                      debt.isPaid ? "text-success" : "text-danger"
                    }`}
                  >
                    {formatCurrency(debt.amount)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {debt.isPaid ? "مدفوع" : "غير مدفوع"}
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    onClick={() => handleOpenDialog(debt)}
                    size="sm"
                    variant="outline"
                  >
                    تعديل
                  </Button>
                  <Button
                    onClick={() => handleDelete(debt.id)}
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
