
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  Menu, 
  X, 
  ShoppingCart, 
  User, 
  Home, 
  Info, 
  Package, 
  MessageSquare, 
  LogIn, 
  UserPlus, 
  LogOut, 
  Settings 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: "Accueil", href: "/", icon: <Home className="h-4 w-4 mr-2" /> },
    { name: "À Propos", href: "/about", icon: <Info className="h-4 w-4 mr-2" /> },
    { name: "Produits", href: "/products", icon: <Package className="h-4 w-4 mr-2" /> },
    { name: "Contact", href: "/contact", icon: <MessageSquare className="h-4 w-4 mr-2" /> },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-[#ea384c] shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img
                className="h-10 w-auto"
                src="/placeholder.svg"
                alt="Elixir Drinks Logo"
              />
              <span className="ml-2 text-xl font-semibold text-white">Elixir Drinks</span>
            </Link>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:flex md:items-center">
            <NavigationMenu className="mr-4">
              <NavigationMenuList>
                {navigation.map((item) => (
                  <NavigationMenuItem key={item.name}>
                    <Link to={item.href}>
                      <NavigationMenuLink 
                        className={`${navigationMenuTriggerStyle()} text-white hover:bg-white/10 hover:text-white ${
                          isActive(item.href) ? "bg-white/20" : ""
                        }`}
                      >
                        {item.icon}
                        {item.name}
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* User actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center gap-2 text-white hover:bg-white/10">
                    <User className="h-4 w-4" />
                    <span>{user.username}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="w-full flex items-center">
                        <Settings className="h-4 w-4 mr-2" />
                        Tableau de bord
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="w-full flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Mon profil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="flex items-center">
                    <LogOut className="h-4 w-4 mr-2" />
                    Déconnexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild className="text-white hover:bg-white/10">
                  <Link to="/login" className="flex items-center">
                    <LogIn className="h-4 w-4 mr-2" />
                    Connexion
                  </Link>
                </Button>
                <Button size="sm" asChild className="bg-white text-[#ea384c] hover:bg-white/90">
                  <Link to="/register" className="flex items-center">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Créer un compte
                  </Link>
                </Button>
              </>
            )}
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-white/10 focus:outline-none"
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
        <div className="pt-2 pb-3 space-y-1 bg-white">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center px-3 py-2 text-base font-medium ${
                isActive(item.href)
                  ? "text-[#ea384c] bg-[#ea384c]/10 border-l-4 border-[#ea384c]"
                  : "text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
              }`}
              onClick={() => setIsOpen(false)}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
          {user ? (
            <>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="flex items-center px-3 py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                  onClick={() => setIsOpen(false)}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Tableau de bord
                </Link>
              )}
              <Link
                to="/profile"
                className="flex items-center px-3 py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                onClick={() => setIsOpen(false)}
              >
                <User className="h-4 w-4 mr-2" />
                Mon profil
              </Link>
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="flex items-center w-full text-left px-3 py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="flex items-center px-3 py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                onClick={() => setIsOpen(false)}
              >
                <LogIn className="h-4 w-4 mr-2" />
                Connexion
              </Link>
              <Link
                to="/register"
                className="flex items-center px-3 py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                onClick={() => setIsOpen(false)}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Créer un compte
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
