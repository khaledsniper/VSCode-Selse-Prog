import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  ShoppingCart,
  CreditCard,
  DollarSign,
  Settings,
  LogOut,
  Menu,
  X,
  FileText,
  HardDrive,
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

/**
 * Sidebar Component
 * Design: Neumorphic UI with navy primary color
 * Features: Navigation menu with collapsible on mobile
 */
export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    {
      id: "dashboard",
      label: "لوحة التحكم",
      icon: BarChart3,
    },
    {
      id: "sales",
      label: "المبيعات",
      icon: ShoppingCart,
    },
    {
      id: "debts",
      label: "الديون",
      icon: CreditCard,
    },
    {
      id: "expenses",
      label: "المصروفات",
      icon: DollarSign,
    },
    {
      id: "reports",
      label: "التقارير",
      icon: FileText,
    },
    {
      id: "backup",
      label: "النسخ الاحتياطية",
      icon: HardDrive,
    },
    {
      id: "settings",
      label: "الإعدادات",
      icon: Settings,
    },
  ];

  const handleLogout = () => {
    if (confirm("هل تريد تسجيل الخروج؟")) {
      logout();
    }
  };

  const handleTabChange = (tab: string) => {
    onTabChange(tab);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-4 z-50 md:hidden p-2 neumorphic-btn bg-primary text-primary-foreground"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed right-0 top-0 h-screen w-64 bg-sidebar text-sidebar-foreground transform transition-transform duration-300 z-40 md:relative md:translate-x-0 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ boxShadow: "var(--shadow-md)" }}
      >
        <div className="p-6 h-full flex flex-col">
          {/* Logo/Title */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-primary">إدارة المكتب</h2>
            <p className="text-sm text-muted-foreground mt-1">
              نظام الحسابات
            </p>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-sidebar-foreground hover:bg-secondary"
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="pt-6 border-t border-sidebar-border">
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full flex items-center justify-center gap-2 text-destructive hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <LogOut size={18} />
              <span>تسجيل الخروج</span>
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
