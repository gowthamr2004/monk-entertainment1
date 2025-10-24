import { Home, ListMusic, Upload, History, Info, Music, LogOut } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Sidebar = () => {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  const baseMenuItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: ListMusic, label: "Playlist", path: "/playlist" },
    { icon: History, label: "History", path: "/history" },
    { icon: Info, label: "About", path: "/about" },
  ];

  // Only show upload for admin users
  const menuItems = isAdmin
    ? [
        ...baseMenuItems.slice(0, 2),
        { icon: Upload, label: "Upload", path: "/upload" },
        ...baseMenuItems.slice(2),
      ]
    : baseMenuItems;

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-[240px] bg-sidebar border-r border-sidebar-border flex flex-col z-50">
      {/* Logo */}
      <div className="px-6 py-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-lg">
            <Music className="w-7 h-7 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">MONK</h1>
            <p className="text-[10px] text-muted-foreground tracking-wider">ENTERTAINMENT</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200",
                "hover:bg-sidebar-accent/60",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  : "text-sidebar-foreground/70 hover:text-sidebar-foreground"
              )
            }
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            <span className="text-[15px]">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Profile Footer */}
      <div className="p-4 border-t border-sidebar-border/50 space-y-3">
        {user ? (
          <>
            <div className="flex items-center gap-3 px-2">
              <Avatar className="w-10 h-10 border-2 border-primary/20">
                <AvatarFallback className="bg-gradient-primary text-primary-foreground font-semibold">
                  {user.email?.[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{user.email}</p>
                {isAdmin && (
                  <span className="text-[11px] text-primary font-semibold">Admin</span>
                )}
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full rounded-lg hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
              onClick={handleSignOut}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </>
        ) : (
          <Button
            variant="default"
            size="sm"
            className="w-full rounded-lg"
            onClick={() => navigate("/auth")}
          >
            Sign In
          </Button>
        )}
        <div className="text-[10px] text-muted-foreground/60 text-center pt-1">
          © 2025 Monk Entertainment
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
