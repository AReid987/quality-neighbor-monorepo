import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Play, 
  FileText, 
  Settings, 
  Users, 
  Database,
  PenTool,
  BarChart3
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Runs', href: '/runs', icon: Play },
  { name: 'Content', href: '/content', icon: FileText },
  { name: 'Sources', href: '/sources', icon: Database },
  { name: 'Blog Configs', href: '/blog-config', icon: PenTool },
  { name: 'Demographics', href: '/demographics', icon: Users },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
];

interface SidebarProps {
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const location = useLocation();

  return (
    <div className={cn('flex flex-col h-full bg-background border-r', className)}>
      {/* Logo */}
      <div className="flex items-center h-16 px-6 border-b">
        <Link to="/dashboard" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <LayoutDashboard className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">Dashboard</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href || 
                          (item.href !== '/dashboard' && location.pathname.startsWith(item.href));
          
          return (
            <Link key={item.name} to={item.href}>
              <Button
                variant={isActive ? 'secondary' : 'ghost'}
                className={cn(
                  'w-full justify-start h-10',
                  isActive && 'bg-secondary text-secondary-foreground'
                )}
              >
                <item.icon className="mr-3 h-4 w-4" />
                {item.name}
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t">
        <p className="text-xs text-muted-foreground text-center">
          Multi-Source Dashboard v1.0
        </p>
      </div>
    </div>
  );
};