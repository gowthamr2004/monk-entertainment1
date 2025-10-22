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
    <aside className="fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col z-50">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <Music className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">MONK</h1>
            <p className="text-xs text-muted-foreground">ENTERTAINMENT</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                  : "text-sidebar-foreground"
              )
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Profile Footer */}
      <div className="p-4 border-t border-sidebar-border space-y-3">
        {user ? (
          <>
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user.email?.[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.email}</p>
                {isAdmin && (
                  <span className="text-xs text-primary font-semibold">Admin</span>
                )}
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
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
            className="w-full"
            onClick={() => navigate("/auth")}
          >
            Sign In
          </Button>
        )}
        <div className="text-xs text-muted-foreground text-center">
          © 2025 Monk Entertainment
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
