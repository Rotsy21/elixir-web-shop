
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface AdminSearchProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

export function AdminSearch({ searchTerm, setSearchTerm }: AdminSearchProps) {
  return (
    <div className="flex items-center mb-6">
      <div className="relative flex-grow max-w-md">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher dans tous les tableaux..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  );
}
