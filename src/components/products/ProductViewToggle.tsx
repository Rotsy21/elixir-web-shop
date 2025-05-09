
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProductViewToggleProps {
  defaultValue: string;
}

export default function ProductViewToggle({ defaultValue }: ProductViewToggleProps) {
  return (
    <div className="flex justify-end mb-4">
      <TabsList>
        <TabsTrigger 
          value="grid" 
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
          </svg>
        </TabsTrigger>
        <TabsTrigger 
          value="list" 
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
          </svg>
        </TabsTrigger>
      </TabsList>
    </div>
  );
}
