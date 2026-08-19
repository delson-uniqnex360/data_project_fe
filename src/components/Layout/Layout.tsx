import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Menu, LayoutDashboard, Pickaxe } from "lucide-react";

// Add or edit navigation items here
const NAV_ITEMS = [
  {
    to: "/",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    to: "/admin/extract",
    label: "Extract Data",
    icon: Pickaxe,
  },
  // Example to add a new page:
  // { to: "/extract", label: "Extract Data", icon: FileText },
];

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* SIDEBAR */}
      <aside
        className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Header with Logo and Collapse Toggle */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 flex-shrink-0">
          {!collapsed && (
            <h1 className="font-bold text-lg text-slate-900">Data Extract</h1>
          )}
          <button
            onClick={() => setCollapsed((prev) => !prev)}
            className="text-slate-600 hover:bg-gray-100 p-2 rounded-lg transition mx-auto"
            aria-label="Toggle Sidebar"
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Navigation Items List */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;

            return (
              <Link
                key={item.to}
                to={item.to}
                className={`relative flex items-center ${
                  collapsed ? "justify-center" : "justify-start"
                } gap-3 px-4 py-3 rounded-lg transition-all font-medium ${
                  isActive
                    ? "bg-gray-100 text-blue-600"
                    : "text-slate-600 hover:bg-gray-50 hover:text-slate-900"
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-0 h-full w-1 bg-blue-500 rounded-r" />
                )}

                <Icon
                  className={`text-xl min-w-[20px] ${
                    isActive ? "text-blue-600" : "text-slate-500"
                  }`}
                />

                {!collapsed && (
                  <span className="text-sm whitespace-nowrap">
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* CONTENT AREA */}
      <main className="flex-1 overflow-auto p-8 bg-slate-50/50">
        <Outlet />
      </main>
    </div>
  );
}
