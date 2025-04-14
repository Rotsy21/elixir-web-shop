
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Menu, X, ShoppingCart, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: "Accueil", href: "/" },
    { name: "À Propos", href: "/about" },
    { name: "Produits", href: "/products" },
    { name: "Contact", href: "/contact" },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img
                className="h-10 w-auto"
                src="/placeholder.svg"
                alt="Elixir Drinks Logo"
              />
              <span className="ml-2 text-xl font-semibold text-primary">Elixir Drinks</span>
            </Link>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:ml-6 md:flex md:space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? "text-primary border-b-2 border-primary"
                    : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* User actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{user.username}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="w-full">Tableau de bord</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="w-full">Mon profil</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>Déconnexion</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">Connexion</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/register">Créer un compte</Link>
                </Button>
              </>
            )}
            <Button variant="outline" size="icon">
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
              onClick={() => setIsOpen(!isOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isOpen ? "block" : "hidden"}`}>
        <div className="pt-2 pb-3 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`block px-3 py-2 text-base font-medium ${
                isActive(item.href)
                  ? "text-primary bg-primary/10 border-l-4 border-primary"
                  : "text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
              }`}
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          {user ? (
            <>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="block px-3 py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                  onClick={() => setIsOpen(false)}
                >
                  Tableau de bord
                </Link>
              )}
              <Link
                to="/profile"
                className="block px-3 py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                onClick={() => setIsOpen(false)}
              >
                Mon profil
              </Link>
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="block px-3 py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                onClick={() => setIsOpen(false)}
              >
                Connexion
              </Link>
              <Link
                to="/register"
                className="block px-3 py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                onClick={() => setIsOpen(false)}
              >
                Créer un compte
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
