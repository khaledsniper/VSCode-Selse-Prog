import { useState } from "react";
import { useData, Sale } from "@/contexts/DataContext";
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
import { formatCurrency, formatDateArabic, calculateProfit } from "@/lib/utils";
import { toast } from "sonner";

/**
 * SalesPage Component
 * Design: Neumorphic cards with form dialogs
 * Features: Add, edit, delete sales with calculations
 */
export default function SalesPage() {
  const { sales, addSale, updateSale, deleteSale } = useData();
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState<Omit<Sale, "id">>({
    designType: "",
    customerName: "",
    customerPhone: "",
    quantity: 1,
    revenue: 0,
    materials: 0,
    expenses: 0,
    netProfit: 0,
    paymentMethod: "cash",
    date: new Date().toISOString().split("T")[0],
  });

  const designTypes = [
    "يفط",
    "بانر",
    "ملصقات",
    "مطوية",
    "منيوه",
    "فلاير",
    "بروشور",
    "كارت عمل",
    "أخرى",
  ];

  const handleOpenDialog = (sale?: Sale) => {
    if (sale) {
      setEditingId(sale.id);
      setFormData({
        designType: sale.designType,
        customerName: sale.customerName,
        customerPhone: sale.customerPhone,
        quantity: sale.quantity,
        revenue: sale.revenue,
        materials: sale.materials,
        expenses: sale.expenses,
        netProfit: sale.netProfit,
        paymentMethod: sale.paymentMethod,
        date: sale.date,
        image: sale.image,
      });
    } else {
      setEditingId(null);
      setFormData({
        designType: "",
        customerName: "",
        customerPhone: "",
        quantity: 1,
        revenue: 0,
        materials: 0,
        expenses: 0,
        netProfit: 0,
        paymentMethod: "cash",
        date: new Date().toISOString().split("T")[0],
      });
    }
    setIsOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.designType ||
      !formData.customerName ||
      !formData.customerPhone
    ) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    const netProfit = calculateProfit(
      formData.revenue,
      formData.materials,
      formData.expenses
    );

    if (editingId) {
      updateSale(editingId, { ...formData, netProfit });
      toast.success("تم تحديث المبيعة بنجاح");
    } else {
      addSale({ ...formData, netProfit });
      toast.success("تم إضافة مبيعة جديدة");
    }

    setIsOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("هل تريد حذف هذه المبيعة؟")) {
      deleteSale(id);
      toast.success("تم حذف المبيعة");
    }
  };

  const filteredSales = sales.filter(
    (sale) =>
      sale.customerName.includes(searchTerm) ||
      sale.customerPhone.includes(searchTerm) ||
      sale.designType.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">المبيعات</h1>
          <p className="text-muted-foreground mt-1">
            إدارة مبيعات التصميمات الدعائية
          </p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => handleOpenDialog()}
              className="neumorphic-btn bg-primary text-primary-foreground gap-2"
            >
              <Plus size={20} />
              إضافة مبيعة
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingId ? "تعديل المبيعة" : "إضافة مبيعة جديدة"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Design Type */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  نوع التصميم *
                </label>
                <Select
                  value={formData.designType}
                  onValueChange={(value) =>
                    setFormData({ ...formData, designType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر نوع التصميم" />
                  </SelectTrigger>
                  <SelectContent>
                    {designTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-4">
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
              </div>

              {/* Financial Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    الكمية
                  </label>
                  <Input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        quantity: parseInt(e.target.value) || 0,
                      })
                    }
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    الإيراد (ج.م)
                  </label>
                  <Input
                    type="number"
                    value={formData.revenue}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        revenue: parseFloat(e.target.value) || 0,
                      })
                    }
                    step="0.01"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    الخامات المستهلكة (ج.م)
                  </label>
                  <Input
                    type="number"
                    value={formData.materials}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        materials: parseFloat(e.target.value) || 0,
                      })
                    }
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    المصروفات (ج.م)
                  </label>
                  <Input
                    type="number"
                    value={formData.expenses}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        expenses: parseFloat(e.target.value) || 0,
                      })
                    }
                    step="0.01"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  طريقة الدفع
                </label>
                <Select
                  value={formData.paymentMethod}
                  onValueChange={(value: "cash" | "credit") =>
                    setFormData({ ...formData, paymentMethod: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">نقدي</SelectItem>
                    <SelectItem value="credit">على الحساب</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date */}
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

              {/* Profit Display */}
              <div className="p-4 bg-success/10 rounded-lg border border-success/20">
                <p className="text-sm text-muted-foreground">صافي الربح</p>
                <p className="text-2xl font-bold text-success">
                  {formatCurrency(
                    calculateProfit(
                      formData.revenue,
                      formData.materials,
                      formData.expenses
                    )
                  )}
                </p>
              </div>

              {/* Submit Button */}
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

      {/* Search */}
      <Input
        placeholder="ابحث عن عميل أو نوع تصميم..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="neumorphic-input"
      />

      {/* Sales List */}
      <div className="space-y-3">
        {filteredSales.length === 0 ? (
          <Card className="neumorphic-card p-8 text-center">
            <p className="text-muted-foreground">لا توجد مبيعات حتى الآن</p>
          </Card>
        ) : (
          filteredSales.map((sale) => (
            <Card key={sale.id} className="neumorphic-card p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-bold text-foreground">
                    {sale.customerName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {sale.designType} • {formatDateArabic(new Date(sale.date))}
                  </p>
                </div>
                <div className="text-right mr-4">
                  <p className="font-bold text-success">
                    {formatCurrency(sale.netProfit)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {sale.paymentMethod === "cash" ? "نقدي" : "على الحساب"}
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    onClick={() => handleOpenDialog(sale)}
                    size="sm"
                    variant="outline"
                  >
                    <Edit2 size={16} />
                  </Button>
                  <Button
                    onClick={() => handleDelete(sale.id)}
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
