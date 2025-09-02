import { Search, Bell, Sun, Moon, User } from 'lucide-react';
import { useTheme } from '../ThemeProvider';

const Topbar = () => {
  const { theme, setTheme } = useTheme();

  return (
    <header className="h-16 bg-background border-b border flex items-center justify-between px-6">
      <div className="flex items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 w-64 bg-accent rounded-xl shadow-soft-inset focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 rounded-full hover:bg-accent shadow-soft-inset">
          {theme === 'dark' ? <Sun className="w-6 h-6 text-muted-foreground" /> : <Moon className="w-6 h-6 text-muted-foreground" />}
        </button>
        <button className="p-2 rounded-full hover:bg-accent shadow-soft-inset">
          <Bell className="w-6 h-6 text-muted-foreground" />
        </button>
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-soft">
            <User className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <p className="font-semibold">Admin</p>
            <p className="text-sm text-muted-foreground">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
