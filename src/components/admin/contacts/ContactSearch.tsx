
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ContactSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function ContactSearch({ searchTerm, onSearchChange }: ContactSearchProps) {
  return (
    <div className="relative">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input 
        placeholder="Rechercher un message..." 
        className="pl-8" 
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
}
