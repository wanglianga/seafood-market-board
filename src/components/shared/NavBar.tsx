import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import type { DeviceType } from "@/lib/types";
import { cn } from "@/lib/utils";

interface NavBarProps {
  deviceType: DeviceType;
}

const links = [
  { to: "/", label: "首页" },
  { to: "/board", label: "大屏价牌" },
  { to: "/staff", label: "员工管理" },
];

export default function NavBar({ deviceType }: NavBarProps) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isPhone = deviceType === "phone";

  return (
    <nav className="sticky top-0 z-50 bg-ocean-900/90 backdrop-blur-sm border-b border-ocean-700/50">
      <div className="container mx-auto flex items-center justify-between px-4 h-14">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold text-foam-100">
          🐟 海鲜市集
        </Link>

        {isPhone ? (
          <button
            onClick={() => setOpen(!open)}
            className="text-foam-200 p-2"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        ) : (
          <div className="flex items-center gap-6">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  "text-sm font-medium transition-colors",
                  location.pathname === link.to
                    ? "text-coral-500"
                    : "text-foam-300 hover:text-foam-100"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>

      {isPhone && open && (
        <div className="border-t border-ocean-700/50 bg-ocean-900/95 backdrop-blur-sm">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className={cn(
                "block px-6 py-3 text-sm font-medium transition-colors",
                location.pathname === link.to
                  ? "text-coral-500 bg-ocean-800/50"
                  : "text-foam-300 hover:text-foam-100 hover:bg-ocean-800/30"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
