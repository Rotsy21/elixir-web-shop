
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { addNewsletter } from "@/data/mockData";
import { toast } from "sonner";
import { Mail, MapPin, Phone, Facebook, Twitter, Instagram } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Veuillez saisir une adresse email valide");
      return;
    }

    setIsSubscribing(true);
    try {
      await addNewsletter(email);
      toast.success("Merci pour votre inscription à la newsletter!");
      setEmail("");
    } catch (error) {
      toast.error("Une erreur est survenue lors de l'inscription");
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center mb-4">
              <img 
                src="/placeholder.svg" 
                alt="Elixir Drinks Logo" 
                className="h-10 w-auto"
              />
              <span className="ml-2 text-xl font-bold text-primary">Elixir Drinks</span>
            </Link>
            <p className="text-gray-400 mb-4">
              Des boissons rafraîchissantes pour tous les moments de la journée.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Liens rapides</h2>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-primary transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-primary transition-colors">
                  À propos
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-400 hover:text-primary transition-colors">
                  Produits
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Contact</h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-primary mr-2 mt-0.5" />
                <span className="text-gray-400">123 Rue des Boissons, 75001 Paris</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-primary mr-2" />
                <span className="text-gray-400">+33 1 23 45 67 89</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-primary mr-2" />
                <span className="text-gray-400">contact@elixir-drinks.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Newsletter</h2>
            <p className="text-gray-400 mb-4">
              Inscrivez-vous pour recevoir nos offres et nouveautés.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col space-y-2">
              <Input
                type="email"
                placeholder="Votre adresse email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
              />
              <Button 
                type="submit" 
                disabled={isSubscribing}
                className="w-full"
              >
                {isSubscribing ? "Inscription..." : "S'inscrire"}
              </Button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-400 text-sm">
          <p>© 2025 Elixir Drinks. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
