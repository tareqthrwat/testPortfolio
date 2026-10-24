import { useState, useEffect } from 'react';
import { NavLink, Link, Outlet, useLocation } from 'react-router-dom';
import {
  FiLayout,
  FiFolder,
  FiCode,
  FiSettings,
  FiExternalLink,
  FiMenu,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiDatabase,
} from 'react-icons/fi';
import { usePortfolio } from '../context/usePortfolio';

export default function AdminLayout() {
  const location = useLocation();
  const { projects, skills } = usePortfolio();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    // Explicitly guarantee native cursor on admin pages
    document.body.classList.remove('custom-cursor-active');
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  // Keyboard accessibility: Escape closes mobile drawer
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isMobileOpen) {
        setIsMobileOpen(false);
      }
    };
    if (isMobileOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isMobileOpen]);

  const navItems = [
    {
      path: '/admin',
      label: 'Overview',
      icon: FiLayout,
      end: true,
    },
    {
      path: '/admin/projects',
      label: 'Projects',
      icon: FiFolder,
      badge: projects.length,
    },
    {
      path: '/admin/skills',
      label: 'Skills',
      icon: FiCode,
      badge: skills.length,
    },
    {
      path: '/admin/settings',
      label: 'Settings',
      icon: FiSettings,
    },
  ];

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/admin':
        return 'Overview';
      case '/admin/projects':
        return 'Projects Management';
      case '/admin/skills':
        return 'Skills Management';
      case '/admin/settings':
        return 'Portfolio Settings';
      default:
        return 'Admin Dashboard';
    }
  };

  return (
    <div className="admin-mode flex min-h-screen bg-[#0B1120] text-[#F8FAFC] font-sans">
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-[#334155] bg-[#111827] transition-all duration-300 md:static ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } ${isCollapsed ? 'md:w-20' : 'w-64'}`}
      >
        {/* Brand / Logo */}
        <div className="flex h-16 items-center justify-between border-b border-[#334155] px-4">
          <Link
            to="/admin"
            className={`flex items-center gap-3 overflow-hidden ${
              isCollapsed ? 'justify-center w-full' : ''
            }`}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#38BDF8]/10 border border-[#38BDF8]/30 text-[#38BDF8] font-bold">
              P
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-wider text-[#F8FAFC]">
                  PORTFOLIO
                </span>
                <span className="text-[10px] uppercase tracking-wider text-[#38BDF8] font-semibold">
                  Admin Console
                </span>
              </div>
            )}
          </Link>

          {/* Mobile close button */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="rounded-lg p-1.5 text-[#94A3B8] hover:bg-[#1E293B] hover:text-[#F8FAFC] md:hidden"
            aria-label="Close sidebar"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-1 flex-col justify-between overflow-y-auto px-3 py-6">
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? 'bg-[#1E293B] text-[#38BDF8] font-semibold border border-[#38BDF8]/30 shadow-xs'
                        : 'text-[#94A3B8] hover:bg-[#1E293B]/60 hover:text-[#F8FAFC]'
                    } ${isCollapsed ? 'justify-center' : ''}`
                  }
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon
                    className={`h-5 w-5 shrink-0 transition-colors ${
                      isCollapsed ? 'mx-auto' : ''
                    }`}
                  />
                  {!isCollapsed && (
                    <>
                      <span className="flex-1">{item.label}</span>
                      {item.badge !== undefined && (
                        <span className="rounded-full bg-[#1E293B] px-2 py-0.5 text-[11px] font-semibold text-[#94A3B8] group-hover:text-[#F8FAFC] border border-[#334155]">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Bottom Actions & Footer */}
          <div className="space-y-4 pt-6 border-t border-[#334155]/60">
            {/* View Live Site Link */}
            <Link
              to="/"
              className={`flex items-center gap-3 rounded-xl border border-[#334155] bg-[#1E293B]/40 px-3 py-2.5 text-xs font-semibold tracking-wide text-[#94A3B8] transition hover:border-[#38BDF8]/50 hover:bg-[#1E293B] hover:text-[#F8FAFC] ${
                isCollapsed ? 'justify-center' : ''
              }`}
              title="View Public Portfolio"
            >
              <FiExternalLink className="h-4 w-4 shrink-0 text-[#22D3EE]" />
              {!isCollapsed && <span>View Public Site</span>}
            </Link>

            {/* Storage Info Badge */}
            {!isCollapsed && (
              <div className="rounded-xl border border-[#334155]/60 bg-[#1E293B]/20 p-3">
                <div className="flex items-center gap-2 text-[11px] text-[#94A3B8]">
                  <FiDatabase className="h-3.5 w-3.5 text-[#38BDF8]" />
                  <span>Browser LocalStorage</span>
                </div>
                <div className="mt-1 flex items-center justify-between text-[10px] text-[#94A3B8]/70">
                  <span>Schema v1</span>
                  <span className="flex items-center gap-1 text-[#22C55E]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E]" />
                    Active
                  </span>
                </div>
              </div>
            )}

            {/* Desktop Collapse Toggle */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden md:flex w-full items-center justify-center rounded-lg border border-[#334155]/50 py-2 text-[#94A3B8] hover:bg-[#1E293B] hover:text-[#F8FAFC] transition"
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? (
                <FiChevronRight className="h-4 w-4" />
              ) : (
                <FiChevronLeft className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Shell */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#334155] bg-[#111827]/90 px-4 backdrop-blur-md sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileOpen(true)}
              className="rounded-lg border border-[#334155] p-2 text-[#94A3B8] hover:bg-[#1E293B] hover:text-[#F8FAFC] md:hidden"
              aria-label="Open sidebar"
            >
              <FiMenu className="h-5 w-5" />
            </button>

            {/* Breadcrumb / Title */}
            <div>
              <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
                <span>Admin</span>
                <span>/</span>
                <span className="text-[#38BDF8] font-medium">{getPageTitle()}</span>
              </div>
              <h1 className="text-base font-bold text-[#F8FAFC] hidden sm:block">
                {getPageTitle()}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex items-center gap-2 rounded-lg border border-[#334155] bg-[#1E293B] px-3 py-1.5 text-xs font-semibold text-[#F8FAFC] transition hover:border-[#38BDF8] hover:text-[#38BDF8]"
            >
              <FiExternalLink className="h-3.5 w-3.5 text-[#38BDF8]" />
              <span className="hidden sm:inline">Live Portfolio</span>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
