import { Link, useLocation } from "react-router-dom";
import { Fish, ClipboardList, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { to: "/", label: "活鲜池", icon: Fish },
  { to: "/order/latest", label: "我的订单", icon: ClipboardList },
  { to: "/board", label: "大屏", icon: Monitor },
];

export default function TabBar() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-ocean-900 border-t border-ocean-700/50"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const active = location.pathname === tab.to;
          const Icon = tab.icon;
          return (
            <Link
              key={tab.to}
              to={tab.to}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors",
                active ? "text-coral-500" : "text-foam-300"
              )}
            >
              <Icon size={22} />
              <span className="text-xs">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
