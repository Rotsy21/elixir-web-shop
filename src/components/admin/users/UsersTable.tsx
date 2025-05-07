
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User } from "@/models/types";
import { Download, PlusCircle, Search } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UsersList } from "./UsersList";
import { AddUserDialog } from "./AddUserDialog";
import { EditUserDialog } from "./EditUserDialog";
import { toast } from "@/hooks/use-toast";

interface UsersTableProps {
  users: User[];
  isLoading: boolean;
}

export function UsersTable({ users: initialUsers, isLoading }: UsersTableProps) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<Partial<User> | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.id.toString().includes(searchTerm)
    );
  }, [users, searchTerm]);
  
  // Get current page items
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredUsers, currentPage, itemsPerPage]);
  
  // Calculate total pages
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / itemsPerPage));
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleEdit = (id: string) => {
    const userToEdit = users.find(user => user.id === id);
    if (userToEdit) {
      setCurrentUser(userToEdit);
      setIsEditDialogOpen(true);
    }
  };

  const handleAdd = () => {
    setIsAddDialogOpen(true);
  };

  const handleUserAdded = (user: User) => {
    setUsers(prev => [...prev, user]);
    // Après avoir ajouté un utilisateur, on va à la dernière page pour le voir
    setCurrentPage(Math.ceil((users.length + 1) / itemsPerPage));
  };

  const handleUserUpdated = (updatedUser: User) => {
    setUsers(prev => prev.map(user => 
      user.id === updatedUser.id 
        ? updatedUser 
        : user
    ));
  };

  const handleUserDeleted = (id: string) => {
    setUsers(users.filter(user => user.id !== id));
    
    // Reset to page 1 if current page becomes empty
    const newTotalItems = filteredUsers.length - 1;
    const newTotalPages = Math.max(1, Math.ceil(newTotalItems / itemsPerPage));
    if (currentPage > newTotalPages) {
      setCurrentPage(newTotalPages);
    }
  };

  const handleExport = () => {
    toast({
      title: "Export des utilisateurs",
      description: "Les données des utilisateurs ont été exportées.",
    });
    // Ici on pourrait implémenter la logique d'export
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Gestion des utilisateurs</CardTitle>
            <CardDescription>
              Gérez les utilisateurs de votre application
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button size="sm" variant="outline" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Exporter
            </Button>
            <Button size="sm" onClick={handleAdd}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Ajouter un utilisateur
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Rechercher un utilisateur..." 
                className="pl-8" 
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // Reset to first page on search
                }}
              />
            </div>
          </div>
          
          <UsersList 
            users={currentItems}
            isLoading={isLoading}
            onEdit={handleEdit}
            onUserDeleted={handleUserDeleted}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            itemsPerPage={itemsPerPage}
          />
        </CardContent>
      </Card>

      <AddUserDialog 
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onUserAdded={handleUserAdded}
      />

      <EditUserDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        user={currentUser}
        onUserUpdated={handleUserUpdated}
      />
    </>
  );
}
