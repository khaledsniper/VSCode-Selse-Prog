import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, AlertCircle } from "lucide-react";
import { toast } from "sonner";

/**
 * LoginPage Component
 * Design: Neumorphic UI with navy and white colors
 * Features: Password authentication with error handling
 */
export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    if (!password.trim()) {
      setError("يرجى إدخال كلمة المرور");
      setIsSubmitting(false);
      return;
    }

    try {
      const success = await login(password);
      if (success) {
        toast.success("تم تسجيل الدخول بنجاح");
      } else {
        setError("كلمة المرور غير صحيحة");
        toast.error("كلمة المرور غير صحيحة");
      }
    } catch (err) {
      setError("حدث خطأ أثناء تسجيل الدخول");
      toast.error("حدث خطأ أثناء تسجيل الدخول");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary p-4">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-primary opacity-5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary opacity-5 rounded-full blur-3xl"></div>

      {/* Login Card */}
      <div className="relative w-full max-w-md">
        <div className="neumorphic-card p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center shadow-md">
                <Lock className="w-8 h-8 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              نظام إدارة المكتب
            </h1>
            <p className="text-muted-foreground">
              مكتب الدعاية والإعلان
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                كلمة المرور
              </label>
              <Input
                id="password"
                type="password"
                placeholder="أدخل كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
                className="neumorphic-input w-full"
              />
              <p className="text-xs text-muted-foreground mt-2">
                كلمة المرور الافتراضية: <span className="font-mono">123</span>
              </p>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full neumorphic-btn bg-primary text-primary-foreground hover:bg-primary/90 font-medium py-2"
            >
              {isSubmitting ? "جاري التحقق..." : "تسجيل الدخول"}
            </Button>
          </form>

          {/* Footer Info */}
          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-center text-xs text-muted-foreground">
              هذا النظام آمن ومحمي بكلمة مرور
            </p>
          </div>
        </div>

        {/* Bottom decorative element */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 نظام إدارة مكتب الدعاية والإعلان
          </p>
        </div>
      </div>
    </div>
  );
}
