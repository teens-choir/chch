import { useState } from "react";
import { useLocation } from "wouter";
import { Music, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Login() {
  const [, setLocation] = useLocation();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    
    if (!username || !password) {
      setErrorMsg("Username and password are required.");
      return;
    }

    // --- EMERGENCY ADMIN BYPASS ---
    // This allows you to enter the dashboard without a database
    if (isLogin) {
      if (username === "eyuelg" && password === "choir2123") {
        setLocation("/admin/dashboard");
        return;
      }
      if (username === "yegetaa" && password === "choir3212") {
        setLocation("/admin/dashboard");
        return;
      }
      
      // If it's not an admin, show a temporary error since Firebase isn't linked yet
      setErrorMsg("Member database is offline. Try Admin login.");
    } else {
      setErrorMsg("Registration is currently disabled until Sunday.");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 relative overflow-hidden theme-normal">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="glass-panel w-full max-w-md p-8 rounded-2xl z-10 page-transition border-primary/30 glow-border bg-black/20 backdrop-blur-xl">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4 glow-border">
            <Music className="text-primary w-8 h-8 glow-text" />
          </div>
          <h1 className="text-3xl font-bold tracking-widest uppercase glow-text text-center">Teenagers Choir</h1>
          <p className="text-primary mt-2 tracking-widest text-sm uppercase">Sanctuary Entrance</p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/30 flex items-center gap-3 text-destructive">
            <AlertCircle size={18} />
            <span className="text-sm font-medium">{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Username</label>
            <Input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-black/40 border-white/10 h-12 focus-visible:ring-primary focus-visible:border-primary transition-all text-white"
              placeholder="Enter username..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Password</label>
            <Input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-black/40 border-white/10 h-12 focus-visible:ring-primary focus-visible:border-primary transition-all text-white"
              placeholder="••••••••"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 text-md font-bold tracking-widest uppercase bg-primary hover:bg-primary/80 text-primary-foreground transition-all hover:scale-[1.02]"
          >
            {isLogin ? "Access System" : "Join Choir"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button 
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-muted-foreground hover:text-primary transition-colors uppercase tracking-wider"
          >
            {isLogin ? "Need clearance? Register here" : "Have clearance? Login here"}
          </button>
        </div>
      </div>
    </div>
  );
}
