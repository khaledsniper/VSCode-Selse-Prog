import { useRef, useState } from "react";
import { useData } from "@/contexts/DataContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { createBackup, restoreFromBackup } from "@/lib/utils";
import { Download, Upload, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

/**
 * BackupPage Component
 * Design: Neumorphic cards with backup/restore functionality
 * Features: Create backups, restore from files, automatic backups
 */
export default function BackupPage() {
  const { clearAllData } = useData();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isRestoring, setIsRestoring] = useState(false);
  const [lastBackupTime, setLastBackupTime] = useState<string | null>(
    localStorage.getItem("lastBackupTime")
  );

  const handleCreateBackup = () => {
    try {
      const backupData = createBackup();
      const blob = new Blob([backupData], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `backup-${new Date().toISOString().split("T")[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);

      const now = new Date().toLocaleString("ar-EG");
      setLastBackupTime(now);
      localStorage.setItem("lastBackupTime", now);
      toast.success("تم إنشاء النسخة الاحتياطية بنجاح");
    } catch (error) {
      toast.error("فشل إنشاء النسخة الاحتياطية");
    }
  };

  const handleRestoreBackup = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsRestoring(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const success = restoreFromBackup(content);

        if (success) {
          toast.success("تم استعادة النسخة الاحتياطية بنجاح");
          // Reload the page to reflect changes
          setTimeout(() => window.location.reload(), 1000);
        } else {
          toast.error("فشل استعادة النسخة الاحتياطية - صيغة الملف غير صحيحة");
        }
      } catch (error) {
        toast.error("حدث خطأ أثناء استعادة النسخة الاحتياطية");
      } finally {
        setIsRestoring(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    };

    reader.readAsText(file);
  };

  const handleClearAllData = () => {
    if (
      confirm(
        "تحذير: هذا سيحذف جميع البيانات بشكل نهائي. هل أنت متأكد؟\n\nتأكد من وجود نسخة احتياطية قبل المتابعة."
      )
    ) {
      clearAllData();
      toast.success("تم حذف جميع البيانات");
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">النسخ الاحتياطية</h1>
        <p className="text-muted-foreground mt-1">
          إدارة نسخ احتياطية من بيانات المكتب
        </p>
      </div>

      {/* Warning Card */}
      <Card className="neumorphic-card p-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
        <div className="flex gap-4">
          <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-yellow-900 dark:text-yellow-200">
              نصيحة مهمة
            </h3>
            <p className="text-sm text-yellow-800 dark:text-yellow-300 mt-1">
              يُنصح بإنشاء نسخة احتياطية دورية من بيانات المكتب لتجنب فقدان
              المعلومات المهمة. احفظ النسخ الاحتياطية في مكان آمن.
            </p>
          </div>
        </div>
      </Card>

      {/* Last Backup Info */}
      {lastBackupTime && (
        <Card className="neumorphic-card p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
          <div className="flex gap-4">
            <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-green-900 dark:text-green-200">
                آخر نسخة احتياطية
              </h3>
              <p className="text-sm text-green-800 dark:text-green-300 mt-1">
                {lastBackupTime}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Backup Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Create Backup */}
        <Card className="neumorphic-card p-8 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
            <Download className="w-8 h-8 text-info" />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-2">
            إنشاء نسخة احتياطية
          </h3>
          <p className="text-sm text-muted-foreground mb-6">
            قم بتنزيل نسخة احتياطية من جميع البيانات الحالية
          </p>
          <Button
            onClick={handleCreateBackup}
            className="neumorphic-btn bg-primary text-primary-foreground w-full"
          >
            <Download size={18} className="mr-2" />
            تنزيل النسخة الاحتياطية
          </Button>
        </Card>

        {/* Restore Backup */}
        <Card className="neumorphic-card p-8 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
            <Upload className="w-8 h-8 text-success" />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-2">
            استعادة نسخة احتياطية
          </h3>
          <p className="text-sm text-muted-foreground mb-6">
            قم باستيراد نسخة احتياطية سابقة لاستعادة البيانات
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleRestoreBackup}
            className="hidden"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isRestoring}
            className="neumorphic-btn bg-success text-primary-foreground w-full"
          >
            <Upload size={18} className="mr-2" />
            {isRestoring ? "جاري الاستعادة..." : "استيراد النسخة الاحتياطية"}
          </Button>
        </Card>
      </div>

      {/* Backup Instructions */}
      <Card className="neumorphic-card p-6">
        <h3 className="text-lg font-bold text-foreground mb-4">
          تعليمات الاستخدام
        </h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-foreground mb-2">
              1. إنشاء نسخة احتياطية
            </h4>
            <p className="text-sm text-muted-foreground">
              انقر على زر "تنزيل النسخة الاحتياطية" لحفظ جميع البيانات الحالية
              في ملف JSON. احفظ هذا الملف في مكان آمن على جهازك.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-foreground mb-2">
              2. استعادة النسخة الاحتياطية
            </h4>
            <p className="text-sm text-muted-foreground">
              انقر على زر "استيراد النسخة الاحتياطية" واختر ملف النسخة
              الاحتياطية (JSON) الذي تريد استعادته. سيتم تحديث جميع البيانات
              تلقائياً.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-foreground mb-2">
              3. الحفاظ على النسخ الاحتياطية
            </h4>
            <p className="text-sm text-muted-foreground">
              يُنصح بإنشاء نسخة احتياطية أسبوعياً على الأقل. احفظ النسخ
              الاحتياطية في أماكن متعددة (جهازك، محرك أقراص خارجي، إلخ).
            </p>
          </div>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="neumorphic-card p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
        <h3 className="text-lg font-bold text-red-900 dark:text-red-200 mb-4">
          منطقة الخطر
        </h3>
        <p className="text-sm text-red-800 dark:text-red-300 mb-4">
          هذه الإجراءات قد تؤدي إلى فقدان البيانات بشكل نهائي. تأكد من وجود
          نسخة احتياطية قبل المتابعة.
        </p>
        <Button
          onClick={handleClearAllData}
          className="w-full bg-red-600 hover:bg-red-700 text-white"
        >
          حذف جميع البيانات
        </Button>
      </Card>
    </div>
  );
}
