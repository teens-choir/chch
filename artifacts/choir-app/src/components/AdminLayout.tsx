import { Link, useLocation } from "wouter";
import { useGetCurrentUser, useLogout } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut, Users, CheckCircle, MessageSquare, Music, LayoutDashboard, Lock, MessageCircle, Megaphone } from "lucide-react";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading } = useGetCurrentUser();
  const logout = useLogout();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  if (isLoading) return <div className="min-h-screen bg-background text-foreground flex items-center justify-center text-muted-foreground tracking-widest uppercase">Authenticating...</div>;
  if (!user || user.role !== "admin") {
    setTimeout(() => setLocation(user ? "/member/home" : "/"), 0);
    return null;
  }

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        queryClient.clear();
        setLocation("/");
      },
      onError: () => {
        queryClient.clear();
        setLocation("/");
      }
    });
  };

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden font-sans">
      <aside className="w-64 glass-panel border-r border-white/10 flex flex-col">
        <div className="p-6">
          <h1 className="text-xl font-bold tracking-widest text-primary glow-text uppercase">COMMAND CENTER</h1>
        </div>
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          <NavLink href="/admin/dashboard" icon={<LayoutDashboard size={18} className="text-primary" />} label="Dashboard" />
          <NavLink href="/admin/members" icon={<Users size={18} className="text-primary" />} label="Members" />
          <NavLink href="/admin/attendance" icon={<CheckCircle size={18} className="text-primary" />} label="Attendance" />
          <NavLink href="/admin/messages" icon={<Megaphone size={18} className="text-primary" />} label="Broadcasts" />
          <NavLink href="/admin/music" icon={<Music size={18} className="text-primary" />} label="Music Rack" />
          <NavLink href="/admin/chat" icon={<MessageCircle size={18} className="text-primary" />} label="Group Chat" />
        </nav>
        <div className="p-4 border-t border-white/10 flex flex-col gap-2">
          <div className="px-4 text-xs text-muted-foreground">{user.username} <span className="text-primary font-semibold">(Admin)</span></div>
          <Link href="/member/change-password" className="w-full flex items-center gap-3 px-4 py-2 rounded-md hover:bg-white/5 text-muted-foreground hover:text-white transition-colors text-sm font-medium">
            <Lock size={18} /> Security
          </Link>
          <button
            onClick={handleLogout}
            disabled={logout.isPending}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-md hover:bg-destructive/20 text-destructive transition-colors text-sm font-medium disabled:opacity-50"
          >
            <LogOut size={18} /> {logout.isPending ? "Logging out..." : "Logout"}
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto p-8 page-transition relative">
        {children}
      </main>
    </div>
  );
}

function NavLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link href={href} className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-white/5 transition-colors text-sm font-medium tracking-wide">
      {icon} {label}
    </Link>
  );
}
