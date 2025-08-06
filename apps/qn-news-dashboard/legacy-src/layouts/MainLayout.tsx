import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import { 
  FiHome, 
  FiTrendingUp, 
  FiFileText, 
  FiSettings, 
  FiPower, 
  FiUser,
  FiGlobe,
  FiBell 
} from 'react-icons/fi';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useMobile } from '@/hooks/use-mobile';
import { ThemeToggle } from '@/components/ThemeToggle';

const sidebarItems = [
  { icon: FiHome, label: 'Dashboard', path: '/dashboard' },
  { icon: FiTrendingUp, label: 'Runs', path: '/runs' },
  { icon: FiFileText, label: 'Content', path: '/content' },
  { icon: FiGlobe, label: 'Blog Config', path: '/blog-config' },
  { icon: FiSettings, label: 'Settings', path: '/settings' },
];

export function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useMobile();
  const { toast } = useToast();

  const handleLogout = () => {
    // Clear authentication and redirect to login
    localStorage.removeItem('auth_token');
    window.location.href = '/login';
    toast({
      title: 'Logged out successfully',
      description: 'You have been logged out of your account',
    });
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform bg-card shadow-md transition-transform duration-200 ease-in-out lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Sidebar Header */}
          <div className="flex h-16 items-center justify-between border-b px-4">
            <h2 className="text-xl font-bold">Multi-Source</h2>
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(false)}
              >
                <FiX className="h-5 w-5" />
              </Button>
            )}
          </div>

          {/* Sidebar Content */}
          <nav className="flex-1 space-y-1 px-2 py-4">
            {sidebarItems.map((item) => (
              <a
                key={item.path}
                href={item.path}
                className="flex items-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.label}
              </a>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="border-t p-4">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleLogout}
            >
              <FiPower className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b bg-card px-4">
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
            >
              <FiMenu className="h-5 w-5" />
            </Button>
          )}

          <div className="flex items-center ml-auto space-x-4">
            <Button variant="ghost" size="icon">
              <FiBell className="h-5 w-5" />
            </Button>
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="rounded-full">
              <FiUser className="h-5 w-5" />
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}