import { ReactNode } from "react";
import { useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  MessageSquare, 
  Music, 
  LogOut 
} from "lucide-react";

export function AdminLayout({ children }: { children: ReactNode }) {
  const [location, setLocation] = useLocation();

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: "Overview", path: "/admin/dashboard" },
    { icon: <Users size={20} />, label: "Members", path: "/admin/members" },
    { icon: <Calendar size={20} />, label: "Attendance", path: "/admin/attendance" },
    { icon: <Music size={20} />, label: "Music Vault", path: "/admin/music" },
    { icon: <MessageSquare size={20} />, label: "Directives", path: "/admin/messages" },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-black/20 backdrop-blur-xl p-6 hidden md:block">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center">
            <Music className="text-primary w-5 h-5" />
          </div>
          <span className="font-bold tracking-widest uppercase text-sm">Admin Portal</span>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => setLocation(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all ${
                location === item.path 
                ? "bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20" 
                : "text-muted-foreground hover:bg-white/5 hover:text-white"
              }`}
            >
              {item.icon}
              <span className="uppercase tracking-widest text-[10px]">{item.label}</span>
            </button>
          ))}
        </nav>

        <button 
          onClick={() => setLocation("/")}
          className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-destructive transition-colors mt-auto absolute bottom-8"
        >
          <LogOut size={20} />
          <span className="uppercase tracking-widest text-[10px]">Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
