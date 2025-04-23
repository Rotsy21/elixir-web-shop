
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Menu, X, User } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import CartIndicator from "@/components/cart/CartIndicator";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const isMobile = useIsMobile();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-200 ${
        scrolled ? "bg-white/95 shadow backdrop-blur-sm dark:bg-gray-950/95" : "bg-white dark:bg-gray-950"
      }`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-2">
            <img src="/placeholder.svg" alt="Logo" className="h-8 w-8" />
            <span className="text-xl font-bold">Elixir</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:items-center md:gap-6">
          <Link to="/" className="text-foreground/70 transition-colors hover:text-foreground">
            Accueil
          </Link>
          <Link to="/products" className="text-foreground/70 transition-colors hover:text-foreground">
            Produits
          </Link>
          <Link to="/about" className="text-foreground/70 transition-colors hover:text-foreground">
            À propos
          </Link>
          <Link to="/contact" className="text-foreground/70 transition-colors hover:text-foreground">
            Contact
          </Link>
          {isAdmin && (
            <Link to="/admin" className="text-foreground/70 transition-colors hover:text-foreground">
              Admin
            </Link>
          )}
        </nav>

        {/* Right side buttons */}
        <div className="flex items-center gap-2">
          <CartIndicator />
          
          {user ? (
            <div className="hidden md:flex md:items-center md:gap-2">
              <span>Bonjour, {user.username}</span>
              <Button variant="outline" onClick={logout}>
                Déconnexion
              </Button>
            </div>
          ) : (
            <div className="hidden md:block">
              <Button variant="ghost" asChild className="mr-2">
                <Link to="/login">Connexion</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Inscription</Link>
              </Button>
            </div>
          )}
          
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobile && isOpen && (
        <div className="md:hidden">
          <div className="flex flex-col space-y-4 px-4 pt-4 pb-8">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="text-foreground/70 transition-colors hover:text-foreground"
            >
              Accueil
            </Link>
            <Link
              to="/products"
              onClick={() => setIsOpen(false)}
              className="text-foreground/70 transition-colors hover:text-foreground"
            >
              Produits
            </Link>
            <Link
              to="/about"
              onClick={() => setIsOpen(false)}
              className="text-foreground/70 transition-colors hover:text-foreground"
            >
              À propos
            </Link>
            <Link
              to="/contact"
              onClick={() => setIsOpen(false)}
              className="text-foreground/70 transition-colors hover:text-foreground"
            >
              Contact
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setIsOpen(false)}
                className="text-foreground/70 transition-colors hover:text-foreground"
              >
                Admin
              </Link>
            )}
            {user ? (
              <>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Bonjour, {user.username}</span>
                </div>
                <Button variant="outline" onClick={() => { logout(); setIsOpen(false); }}>
                  Déconnexion
                </Button>
              </>
            ) : (
              <div className="flex flex-col space-y-2">
                <Button variant="outline" asChild>
                  <Link to="/login" onClick={() => setIsOpen(false)}>
                    Connexion
                  </Link>
                </Button>
                <Button asChild>
                  <Link to="/register" onClick={() => setIsOpen(false)}>
                    Inscription
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
