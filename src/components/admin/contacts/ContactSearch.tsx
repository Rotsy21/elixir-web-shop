
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ContactSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function ContactSearch({ searchTerm, onSearchChange }: ContactSearchProps) {
  const [inputValue, setInputValue] = useState(searchTerm);

  // Synchroniser l'état local avec la prop searchTerm
  useEffect(() => {
    setInputValue(searchTerm);
  }, [searchTerm]);

  // Gérer la soumission du formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange(inputValue);
  };

  // Effacer la recherche
  const handleClear = () => {
    setInputValue("");
    onSearchChange("");
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex w-full max-w-md">
      <div className="relative flex-grow">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Rechercher un message..." 
          className="pl-8 pr-10" 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        {inputValue && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1 h-7 w-7 p-0"
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Effacer la recherche</span>
          </Button>
        )}
      </div>
      <Button type="submit" className="ml-2">
        Rechercher
      </Button>
    </form>
  );
}
