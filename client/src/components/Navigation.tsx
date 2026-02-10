import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { 
  BrainCircuit, 
  Map, 
  Compass, 
  LogOut, 
  Menu,
  X,
  Sparkles,
  BookOpen
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Navigation() {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location === path;

  const NavLinks = () => (
    <>
      <Link href="/dashboard" className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${isActive('/dashboard') ? 'bg-primary/20 text-primary-foreground font-medium' : 'text-muted-foreground hover:text-foreground hover:bg-white/5'}`}>
        <Map className="w-4 h-4" />
        My Roadmaps
      </Link>
      <Link href="/assessment" className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${isActive('/assessment') ? 'bg-primary/20 text-primary-foreground font-medium' : 'text-muted-foreground hover:text-foreground hover:bg-white/5'}`}>
        <Sparkles className="w-4 h-4" />
        Assessment
      </Link>
      <Link href="/resources" className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${isActive('/resources') ? 'bg-primary/20 text-primary-foreground font-medium' : 'text-muted-foreground hover:text-foreground hover:bg-white/5'}`}>
        <BookOpen className="w-4 h-4" />
        Resources
      </Link>

    </>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-purple-400 flex items-center justify-center text-white font-bold shadow-lg shadow-primary/25 group-hover:scale-110 transition-transform">
              AI
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-foreground">
              CareerPath
            </span>
          </Link>

          {/* Desktop Nav */}
          {user && (
            <div className="hidden md:flex items-center gap-2">
              <NavLinks />
            </div>
          )}

          {/* User Profile / Auth */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 pr-4 border-r border-border/40">
                  <span className="text-sm font-medium text-foreground">{user.firstName}</span>
                  <Avatar className="w-8 h-8 border border-border">
                    <AvatarImage src={user.profileImageUrl || undefined} />
                    <AvatarFallback className="bg-primary/20 text-primary-foreground">
                      {user.firstName?.[0]}{user.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => logout()}
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <Button asChild className="gradient-primary shadow-lg shadow-primary/25 border-0">
                <a href="/api/login">Sign In</a>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-card border-l border-border">
                <div className="flex flex-col h-full pt-8 gap-6">
                  {user ? (
                    <>
                      <div className="flex items-center gap-3 pb-6 border-b border-border/40">
                        <Avatar className="w-10 h-10 border border-border">
                          <AvatarImage src={user.profileImageUrl || undefined} />
                          <AvatarFallback className="bg-primary/20 text-primary-foreground">
                            {user.firstName?.[0]}{user.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.firstName} {user.lastName}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <NavLinks />
                      </div>
                      <div className="mt-auto">
                        <Button 
                          variant="destructive" 
                          className="w-full"
                          onClick={() => logout()}
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Logout
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col gap-4">
                      <p className="text-muted-foreground text-center">
                        Sign in to access personalized roadmaps.
                      </p>
                      <Button asChild className="w-full gradient-primary">
                        <a href="/api/login">Sign In</a>
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
