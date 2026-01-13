import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff, Save } from "lucide-react";
import { toast } from "sonner";

/**
 * SettingsPage Component
 * Design: Neumorphic cards with tabbed interface
 * Features: Company settings, password change, app settings
 */
export default function SettingsPage() {
  const { changePassword } = useAuth();
  const { settings, updateSettings } = useData();

  // Company Settings
  const [companySettings, setCompanySettings] = useState({
    companyName: settings.companyName,
    companyAddress: settings.companyAddress,
    companyPhone: settings.companyPhone,
    currency: settings.currency,
  });

  // Password Settings
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Handle company settings save
  const handleSaveCompanySettings = async () => {
    if (!companySettings.companyName.trim()) {
      toast.error("يرجى إدخال اسم الشركة");
      return;
    }

    updateSettings(companySettings);
    toast.success("تم حفظ إعدادات الشركة بنجاح");
  };

  // Handle password change
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsChangingPassword(true);

    if (!passwordForm.oldPassword || !passwordForm.newPassword) {
      toast.error("يرجى ملء جميع الحقول");
      setIsChangingPassword(false);
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("كلمات المرور الجديدة غير متطابقة");
      setIsChangingPassword(false);
      return;
    }

    if (passwordForm.newPassword.length < 3) {
      toast.error("يجب أن تكون كلمة المرور 3 أحرف على الأقل");
      setIsChangingPassword(false);
      return;
    }

    try {
      const success = await changePassword(
        passwordForm.oldPassword,
        passwordForm.newPassword
      );

      if (success) {
        toast.success("تم تغيير كلمة المرور بنجاح");
        setPasswordForm({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        toast.error("كلمة المرور القديمة غير صحيحة");
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء تغيير كلمة المرور");
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">الإعدادات</h1>
        <p className="text-muted-foreground mt-1">
          إدارة إعدادات المكتب والحساب
        </p>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="company" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="company">بيانات الشركة</TabsTrigger>
          <TabsTrigger value="password">كلمة المرور</TabsTrigger>
          <TabsTrigger value="about">معلومات</TabsTrigger>
        </TabsList>

        {/* Company Settings Tab */}
        <TabsContent value="company" className="space-y-6">
          <Card className="neumorphic-card p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">
              بيانات الشركة
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  اسم الشركة
                </label>
                <Input
                  value={companySettings.companyName}
                  onChange={(e) =>
                    setCompanySettings({
                      ...companySettings,
                      companyName: e.target.value,
                    })
                  }
                  placeholder="أدخل اسم الشركة"
                  className="neumorphic-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  العنوان
                </label>
                <Input
                  value={companySettings.companyAddress}
                  onChange={(e) =>
                    setCompanySettings({
                      ...companySettings,
                      companyAddress: e.target.value,
                    })
                  }
                  placeholder="أدخل عنوان الشركة"
                  className="neumorphic-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  رقم الهاتف
                </label>
                <Input
                  value={companySettings.companyPhone}
                  onChange={(e) =>
                    setCompanySettings({
                      ...companySettings,
                      companyPhone: e.target.value,
                    })
                  }
                  placeholder="أدخل رقم الهاتف"
                  className="neumorphic-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  العملة
                </label>
                <Input
                  value={companySettings.currency}
                  onChange={(e) =>
                    setCompanySettings({
                      ...companySettings,
                      currency: e.target.value,
                    })
                  }
                  placeholder="أدخل رمز العملة"
                  className="neumorphic-input"
                />
              </div>

              <Button
                onClick={handleSaveCompanySettings}
                className="w-full neumorphic-btn bg-primary text-primary-foreground gap-2"
              >
                <Save size={18} />
                حفظ التغييرات
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* Password Settings Tab */}
        <TabsContent value="password" className="space-y-6">
          <Card className="neumorphic-card p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">
              تغيير كلمة المرور
            </h3>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  كلمة المرور القديمة
                </label>
                <div className="relative">
                  <Input
                    type={showPasswords.old ? "text" : "password"}
                    value={passwordForm.oldPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        oldPassword: e.target.value,
                      })
                    }
                    placeholder="أدخل كلمة المرور القديمة"
                    className="neumorphic-input pr-10"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPasswords({
                        ...showPasswords,
                        old: !showPasswords.old,
                      })
                    }
                    className="absolute left-3 top-1/2 -translate-y-1/2"
                  >
                    {showPasswords.old ? (
                      <EyeOff size={18} className="text-muted-foreground" />
                    ) : (
                      <Eye size={18} className="text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  كلمة المرور الجديدة
                </label>
                <div className="relative">
                  <Input
                    type={showPasswords.new ? "text" : "password"}
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        newPassword: e.target.value,
                      })
                    }
                    placeholder="أدخل كلمة المرور الجديدة"
                    className="neumorphic-input pr-10"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPasswords({
                        ...showPasswords,
                        new: !showPasswords.new,
                      })
                    }
                    className="absolute left-3 top-1/2 -translate-y-1/2"
                  >
                    {showPasswords.new ? (
                      <EyeOff size={18} className="text-muted-foreground" />
                    ) : (
                      <Eye size={18} className="text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  تأكيد كلمة المرور الجديدة
                </label>
                <div className="relative">
                  <Input
                    type={showPasswords.confirm ? "text" : "password"}
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        confirmPassword: e.target.value,
                      })
                    }
                    placeholder="أعد إدخال كلمة المرور الجديدة"
                    className="neumorphic-input pr-10"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPasswords({
                        ...showPasswords,
                        confirm: !showPasswords.confirm,
                      })
                    }
                    className="absolute left-3 top-1/2 -translate-y-1/2"
                  >
                    {showPasswords.confirm ? (
                      <EyeOff size={18} className="text-muted-foreground" />
                    ) : (
                      <Eye size={18} className="text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isChangingPassword}
                className="w-full neumorphic-btn bg-primary text-primary-foreground"
              >
                {isChangingPassword ? "جاري التحديث..." : "تحديث كلمة المرور"}
              </Button>
            </form>
          </Card>

          {/* Password Tips */}
          <Card className="neumorphic-card p-6 bg-blue-50 dark:bg-blue-900/20">
            <h4 className="font-medium text-foreground mb-3">نصائح الأمان</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• استخدم كلمة مرور قوية تحتوي على أحرف وأرقام</li>
              <li>• تجنب استخدام كلمات سهلة التخمين</li>
              <li>• غير كلمة المرور بشكل دوري</li>
              <li>• لا تشارك كلمة المرور مع أحد</li>
            </ul>
          </Card>
        </TabsContent>

        {/* About Tab */}
        <TabsContent value="about" className="space-y-6">
          <Card className="neumorphic-card p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">
              معلومات التطبيق
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-secondary rounded-lg">
                <span className="text-muted-foreground">اسم التطبيق</span>
                <span className="font-medium text-foreground">
                  نظام إدارة مكتب الدعاية والإعلان
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-secondary rounded-lg">
                <span className="text-muted-foreground">الإصدار</span>
                <span className="font-medium text-foreground">1.0.0</span>
              </div>

              <div className="flex justify-between items-center p-3 bg-secondary rounded-lg">
                <span className="text-muted-foreground">نوع التخزين</span>
                <span className="font-medium text-foreground">محلي (LocalStorage)</span>
              </div>

              <div className="flex justify-between items-center p-3 bg-secondary rounded-lg">
                <span className="text-muted-foreground">الدعم</span>
                <span className="font-medium text-foreground">عربي (RTL)</span>
              </div>
            </div>
          </Card>

          <Card className="neumorphic-card p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">
              الميزات الرئيسية
            </h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="text-success font-bold">✓</span>
                <span>إدارة المبيعات والتصميمات الدعائية</span>
              </li>
              <li className="flex gap-3">
                <span className="text-success font-bold">✓</span>
                <span>تتبع الديون والتحصيلات</span>
              </li>
              <li className="flex gap-3">
                <span className="text-success font-bold">✓</span>
                <span>إدارة المصروفات والفواتير</span>
              </li>
              <li className="flex gap-3">
                <span className="text-success font-bold">✓</span>
                <span>تقارير شاملة وتحليلات</span>
              </li>
              <li className="flex gap-3">
                <span className="text-success font-bold">✓</span>
                <span>نسخ احتياطية واستعادة</span>
              </li>
              <li className="flex gap-3">
                <span className="text-success font-bold">✓</span>
                <span>واجهة Neumorphic عصرية</span>
              </li>
              <li className="flex gap-3">
                <span className="text-success font-bold">✓</span>
                <span>دعم كامل للغة العربية</span>
              </li>
            </ul>
          </Card>

          <Card className="neumorphic-card p-6 text-center">
            <p className="text-sm text-muted-foreground">
              تم تطوير هذا النظام لتسهيل إدارة مكاتب الدعاية والإعلان
            </p>
            <p className="text-xs text-muted-foreground mt-4">
              © 2024 جميع الحقوق محفوظة
            </p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
