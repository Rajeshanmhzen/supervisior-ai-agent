import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import type { IconType } from "react-icons";
import {
  FiAlertTriangle,
  FiBell,
  FiBookOpen,
  FiChevronDown,
  FiClock,
  FiFileText,
  FiFolder,
  FiGrid,
  FiLock,
  FiLogOut,
  FiSettings,
  FiUser,
} from "react-icons/fi";
import { authStorage } from "../services/authStorage";
import MoniveoLogo from "../components/shared/MoniveoLogo";
import { authService } from "../services/auth";
import UploadProjectModal from "../components/shared/UploadProjectModal";

type NavItem = { label: string; icon: IconType; link: string };

const navItems: NavItem[] = [
  { label: "Dashboard", icon: FiGrid, link: "/dashboard" },
  { label: "My Projects", icon: FiFolder, link: "/dashboard/projects" },
  { label: "Reports", icon: FiFileText, link: "/dashboard/reports" },
  { label: "History", icon: FiClock, link: "/dashboard/history" },
  { label: "Guidelines", icon: FiBookOpen, link: "/dashboard/guidelines" },
];

const manageItems: NavItem[] = [
  { label: "Settings", icon: FiSettings, link: "/dashboard/settings" },
  {
    label: "Notifications",
    icon: FiBell,
    link: "/dashboard/notifications",
  },
  { label: "User", icon: FiUser, link: "/dashboard/user" },
];

type ConfirmOptions = {
  message: string;
  onConfirm: () => void;
};

type ConfirmState = {
  isOpen: boolean;
  message: string;
  onConfirm: (() => void) | null;
};

const DashboardConfirmContext = createContext<((options: ConfirmOptions) => void) | null>(
  null,
);

const UploadProjectModalContext = createContext<(() => void) | null>(null);

export const useDashboardConfirm = () => {
  const context = useContext(DashboardConfirmContext);
  if (!context) {
    throw new Error("useDashboardConfirm must be used within DashboardPage.");
  }
  return context;
};

export const useUploadProjectModal = () => {
  const context = useContext(UploadProjectModalContext);
  if (!context) {
    throw new Error("useUploadProjectModal must be used within DashboardPage.");
  }
  return context;
};

const DashboardPage = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(() => authStorage.getUser());
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [confirmState, setConfirmState] = useState<ConfirmState>({
    isOpen: false,
    message: "",
    onConfirm: null,
  });

  useEffect(() => {
    const unsubscribe = authStorage.subscribe(() => {
      setUser(authStorage.getUser());
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!userMenuRef.current) return;
      if (!userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsUserMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    if (!confirmState.isOpen) return undefined;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setConfirmState((prev) => ({
          ...prev,
          isOpen: false,
          onConfirm: null,
        }));
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [confirmState.isOpen]);

  const displayName = user?.fullName?.trim() || "User";
  const initials = useMemo(() => {
    const parts = displayName.split(" ").filter(Boolean);
    if (parts.length === 0) return "U";
    if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "U";
    return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
  }, [displayName]);

  const isActiveLink = (link: string) => {
    if (link === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(link);
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch {
      // ignore logout errors
    } finally {
      authStorage.clear();
      setIsUserMenuOpen(false);
      navigate("/login");
    }
  };

  const openConfirm = useCallback((options: ConfirmOptions) => {
    setConfirmState({
      isOpen: true,
      message: options.message,
      onConfirm: options.onConfirm,
    });
  }, []);

  const openUploadModal = useCallback(() => {
    setIsUploadModalOpen(true);
  }, []);

  const closeUploadModal = useCallback(() => {
    setIsUploadModalOpen(false);
  }, []);

  const handleConfirm = () => {
    const action = confirmState.onConfirm;
    setConfirmState({
      isOpen: false,
      message: "",
      onConfirm: null,
    });
    if (action) action();
  };

  return (
    <DashboardConfirmContext.Provider value={openConfirm}>
      <UploadProjectModalContext.Provider value={openUploadModal}>
        <div className="min-h-screen bg-[#f4f6fb]">
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200">
          <div className="mx-auto flex w-full max-w-screen-2xl items-center justify-between px-6 py-4">
            <div className="flex items-center">
              <div className="text-2xl font-black tracking-tighter text-blue-600 font-headline flex items-center gap-2">
                <MoniveoLogo />
                <span
                  className="font-manrope text-base font-semibold tracking-tight"
                  style={{ color: "#191c1e" }}
                >
                  Moniveo
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSidebarCollapsed((prev) => !prev)}
                className="ml-20 flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100"
                aria-label={
                  sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                  <path d="M9 3v18"></path>
                </svg>
              </button>
            </div>
            <div className="flex items-center gap-3">
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500"
            >
              <FiBell className="text-lg" />
            </button>
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <span className="h-9 w-9 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center">
                  {initials}
                </span>
                <span>{displayName}</span>
              </div>
            </div>
          </div>
        </header>

      <div className="mx-auto w-full max-w-screen-2xl px-6 py-8">
        <div
          className={`grid gap-6 grid-cols-1 ${
            sidebarCollapsed
              ? "lg:grid-cols-[88px_minmax(0,1fr)]"
              : "lg:grid-cols-[280px_minmax(0,1fr)]"
          }`}
        >
          <aside
            className={`rounded-3xl bg-white p-4 shadow-sm ${
              sidebarCollapsed ? "min-w-[88px]" : "min-w-[240px]"
            }`}
          >
            <div
              className={`h-full w-full rounded-3xl bg-white border border-slate-200 p-6 shadow-sm flex flex-col justify-between text-slate-700 transition-all duration-300 ${
                sidebarCollapsed ? "items-center" : ""
              }`}
            >
              <div>
                <p
                  className={`text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 ${
                    sidebarCollapsed ? "sr-only" : ""
                  }`}
                >
                  Main-menu
                </p>
                <div className="mt-4 space-y-2">
                  {navItems.map((item) => {
                    const isActive = isActiveLink(item.link);
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.label}
                        to={item.link}
                        title={item.label}
                        className={`flex w-full items-center gap-3 rounded-xl px-4 py-2 text-sm font-semibold transition-colors whitespace-nowrap ${
                          isActive
                            ? "bg-slate-100 text-slate-900"
                            : "text-slate-600 hover:bg-slate-100"
                        } ${sidebarCollapsed ? "justify-center px-0" : ""}`}
                      >
                        <Icon className="text-[20px]" />
                        <span
                          className={`${sidebarCollapsed ? "sr-only" : ""}`}
                        >
                          {item.label}
                        </span>
                      </Link>
                    );
                  })}
                </div>

                <div className="mt-8">
                  <p
                    className={`text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 ${
                      sidebarCollapsed ? "sr-only" : ""
                    }`}
                  >
                    System
                  </p>
                  <div className="mt-4 space-y-2">
                    {manageItems.map((item) => {
                      const isActive = isActiveLink(item.link);
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.label}
                          to={item.link}
                          title={item.label}
                          className={`flex w-full items-center gap-3 rounded-xl px-4 py-2 text-sm font-semibold transition-colors whitespace-nowrap ${
                            isActive
                              ? "bg-slate-100 text-slate-900"
                              : "text-slate-600 hover:bg-slate-100"
                          } ${sidebarCollapsed ? "justify-center px-0" : ""}`}
                        >
                          <Icon className="text-[20px]" />
                          <span
                            className={`${sidebarCollapsed ? "sr-only" : ""}`}
                          >
                            {item.label}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="mt-10 w-full">
                <div
                  className={`rounded-2xl bg-slate-100 transition-all ${
                    sidebarCollapsed ? "p-0" : "p-4"
                  }`}
                >
                  {!sidebarCollapsed && (
                    <>
                      <p className="text-xs font-semibold text-slate-800">
                        Pro Plan
                      </p>
                      <p className="mt-1 text-[10px] text-slate-500">
                        5 projects remaining
                      </p>
                      <div className="mt-3 h-2 w-full rounded-full bg-white">
                        <div className="h-full w-2/3 rounded-full bg-primary"></div>
                      </div>
                      <div className="mt-4 flex items-center justify-between text-[10px] font-semibold text-slate-500">
                        <span>Auto sync</span>
                        <button
                          type="button"
                          className="relative h-5 w-10 rounded-full bg-white"
                        >
                          <span className="absolute right-1 top-1 h-3 w-3 rounded-full bg-primary"></span>
                        </button>
                      </div>
                    </>
                  )}
                  {sidebarCollapsed && (
                    <div className="flex items-center justify-center h-16">
                      <span className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-slate-700">
                        {initials}
                      </span>
                    </div>
                  )}
                </div>
                {!sidebarCollapsed && (
                  <div className="mt-4 relative w-full" ref={userMenuRef}>
                    <button
                      type="button"
                      onClick={() => setIsUserMenuOpen((prev) => !prev)}
                      className="flex w-full items-center gap-3 rounded-2xl bg-slate-100 px-3 py-2 text-left"
                      aria-expanded={isUserMenuOpen}
                      aria-haspopup="menu"
                    >
                      <span className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-slate-700">
                        {initials}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-slate-800 truncate">
                          {displayName}
                        </p>
                        <p className="text-[10px] text-slate-500 truncate">
                          {user?.email ?? ""}
                        </p>
                      </div>
                      <FiChevronDown className="text-sm text-slate-400" />
                    </button>

                    {isUserMenuOpen && (
                      <div
                        className="absolute left-0 right-0 bottom-full mb-3 rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-xl"
                        role="menu"
                      >
                        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200">
                          <span className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                            {initials}
                          </span>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-800 truncate">
                              {displayName}
                            </p>
                            <p className="text-xs text-slate-500 truncate">
                              {user?.email ?? "user@example.com"}
                            </p>
                          </div>
                        </div>
                        <div className="py-2">
                          <Link
                            to="/dashboard/user"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-100"
                            role="menuitem"
                          >
                            <FiUser className="text-base" />
                            Profile
                          </Link>
                          <Link
                            to="/dashboard/settings"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-100"
                            role="menuitem"
                          >
                            <FiLock className="text-base" />
                            Change Password
                          </Link>
                        </div>
                        <div className="border-t border-slate-200">
                          <button
                            type="button"
                            onClick={handleLogout}
                            className="flex w-full items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-red-50 hover:text-red-600"
                            role="menuitem"
                          >
                            <FiLogOut className="text-base" />
                            Log out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </aside>

          <main className="space-y-6">
            <Outlet />
          </main>
        </div>
      </div>
      {confirmState.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">
          <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl border border-slate-200 p-6">
            <div className="flex items-start gap-3">
              <FiAlertTriangle className="text-red-500 text-3xl" />
              <div>
                <p className="text-base font-semibold text-slate-900">
                  Confirm delete
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  {confirmState.message}
                </p>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() =>
                  setConfirmState({
                    isOpen: false,
                    message: "",
                    onConfirm: null,
                  })
                }
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                No
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
              >
                Yes, delete
              </button>
            </div>
          </div>
        </div>
      )}
        <UploadProjectModal isOpen={isUploadModalOpen} onClose={closeUploadModal} />
        </div>
      </UploadProjectModalContext.Provider>
    </DashboardConfirmContext.Provider>
  );
};

export default DashboardPage;
