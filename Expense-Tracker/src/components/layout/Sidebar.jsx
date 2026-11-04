import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Receipt,
  Tags,
  BarChart3,
  PieChart,
  Settings,
  ChevronLeft,
  ChevronRight,
  Wallet,
  Sparkles,
} from 'lucide-react';

export const Sidebar = ({
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
}) => {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Transactions', path: '/transactions', icon: Receipt },
    { name: 'Categories', path: '/categories', icon: Tags },
    { name: 'Analytics & Reports', path: '/analytics', icon: BarChart3 },
    { name: 'Budget Management', path: '/budget', icon: PieChart },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const closeMobile = () => {
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={closeMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 transition-all duration-300 ease-in-out ${
          isCollapsed ? 'lg:w-20' : 'lg:w-64'
        } ${
          isMobileOpen
            ? 'w-64 translate-x-0 shadow-2xl'
            : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand / Logo Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 flex-shrink-0">
              <Wallet className="w-5 h-5" />
            </div>
            {(!isCollapsed || isMobileOpen) && (
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                  Spend<span className="text-indigo-600 dark:text-indigo-400">Wise</span>
                </span>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                  Finance Tracker
                </span>
              </div>
            )}
          </div>

          {/* Desktop collapse toggle */}
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={closeMobile}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3.5 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 group relative ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-105 ${
                        isActive
                          ? 'text-white'
                          : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-200'
                      }`}
                    />
                    {(!isCollapsed || isMobileOpen) && (
                      <span className="truncate">{item.name}</span>
                    )}
                    {/* Tooltip for collapsed mode */}
                    {isCollapsed && !isMobileOpen && (
                      <div className="absolute left-full ml-3 px-2.5 py-1 bg-slate-900 text-white text-xs rounded-md shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                        {item.name}
                      </div>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Pro / Tip Widget in Sidebar (only when expanded) */}
        {(!isCollapsed || isMobileOpen) && (
          <div className="p-3 m-3 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-indigo-500/5 to-transparent border border-indigo-200/50 dark:border-indigo-900/50">
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700 dark:text-indigo-400 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart Tracking</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Real-time insights and automated budget monitoring for your goals.
            </p>
          </div>
        )}

        {/* User Card at bottom of sidebar */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300 font-bold text-sm flex items-center justify-center flex-shrink-0 border border-indigo-200 dark:border-indigo-800">
              AM
            </div>
            {(!isCollapsed || isMobileOpen) && (
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                  Alex Morgan
                </span>
                <span className="text-[11px] text-slate-400 truncate">
                  alex.morgan@spendwise.app
                </span>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

