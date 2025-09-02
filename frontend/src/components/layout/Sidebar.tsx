import { NavLink } from 'react-router-dom';
import { Home, Book, User, DollarSign, Building, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
  { to: '/dashboard', icon: Home, label: 'Dashboard' },
  { to: '/admissions', icon: User, label: 'Admissions' },
  { to: '/academics', icon: Book, label: 'Academics' },
  { to: '/fees', icon: DollarSign, label: 'Fees' },
  { to: '/hostel', icon: Building, label: 'Hostel' },
];

const Sidebar = () => {
  return (
    <aside className="w-64 bg-background border-r border flex flex-col">
      <div className="h-16 flex items-center justify-center border-b border">
        <h1 className="text-2xl font-bold text-primary">ERP Dashboard</h1>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              cn(
                'flex items-center px-4 py-2 text-lg font-medium rounded-xl transition-all duration-300',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-soft'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:shadow-soft-inset'
              )
            }
          >
            <link.icon className="w-6 h-6 mr-4" />
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className="px-4 py-6 border-t border">
        <button className="w-full flex items-center px-4 py-2 text-lg font-medium rounded-xl text-muted-foreground hover:bg-destructive hover:text-destructive-foreground hover:shadow-soft-inset transition-all duration-300">
          <LogOut className="w-6 h-6 mr-4" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
