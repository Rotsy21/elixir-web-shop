
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { User } from "@/models/types";
import { Download, Edit, PlusCircle, Search, Trash2, Save, UserPlus } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

interface UsersTableProps {
  users: User[];
  isLoading: boolean;
}

interface UserFormData {
  id?: number;
  username: string;
  email: string;
  role: "admin" | "user";
  password?: string;
}

export function UsersTable({ users: initialUsers, isLoading }: UsersTableProps) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserFormData>({
    username: '',
    email: '',
    role: 'user',
    password: ''
  });

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toString().includes(searchTerm)
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentUser(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value: "admin" | "user") => {
    setCurrentUser(prev => ({ ...prev, role: value }));
  };

  const handleDelete = (id: number) => {
    setUsers(users.filter(user => user.id !== id));
    toast({
      title: "Utilisateur supprimé",
      description: "L'utilisateur a été supprimé avec succès.",
    });
  };

  const handleEdit = (id: number) => {
    const userToEdit = users.find(user => user.id === id);
    if (userToEdit) {
      setCurrentUser({
        id: userToEdit.id,
        username: userToEdit.username,
        email: userToEdit.email,
        role: userToEdit.role
      });
      setIsEditDialogOpen(true);
    }
  };

  const handleAdd = () => {
    setCurrentUser({
      username: '',
      email: '',
      role: 'user',
      password: ''
    });
    setIsAddDialogOpen(true);
  };

  const handleSaveEdit = () => {
    setUsers(prev => prev.map(user => 
      user.id === currentUser.id 
        ? { 
            ...user, 
            username: currentUser.username,
            email: currentUser.email,
            role: currentUser.role
          } 
        : user
    ));
    
    setIsEditDialogOpen(false);
    toast({
      title: "Utilisateur modifié",
      description: "L'utilisateur a été modifié avec succès.",
    });
  };

  const handleSaveAdd = () => {
    // Generate a new ID (in a real app, this would come from the backend)
    const newId = Math.max(0, ...users.map(u => u.id)) + 1;
    
    const newUser: User = {
      id: newId,
      username: currentUser.username,
      email: currentUser.email,
      role: currentUser.role,
      createdAt: new Date().toISOString()
    };
    
    setUsers(prev => [...prev, newUser]);
    setIsAddDialogOpen(false);
    toast({
      title: "Utilisateur ajouté",
      description: "Le nouvel utilisateur a été ajouté avec succès.",
    });
  };

  const handleExport = () => {
    toast({
      title: "Export des utilisateurs",
      description: "Les données des utilisateurs ont été exportées.",
    });
    // Ici on pourrait implémenter la logique d'export
  };

  const renderUserForm = (isAdd: boolean) => (
    <div className="space-y-4 py-2">
      <div className="space-y-2">
        <label htmlFor="username" className="text-sm font-medium">Nom d'utilisateur</label>
        <Input 
          id="username"
          name="username"
          value={currentUser.username}
          onChange={handleInputChange}
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">Email</label>
        <Input 
          id="email"
          name="email"
          type="email"
          value={currentUser.email}
          onChange={handleInputChange}
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="role" className="text-sm font-medium">Rôle</label>
        <Select value={currentUser.role} onValueChange={handleRoleChange}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez un rôle" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="user">Utilisateur</SelectItem>
            <SelectItem value="admin">Administrateur</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {isAdd && (
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">Mot de passe</label>
          <Input 
            id="password"
            name="password"
            type="password"
            value={currentUser.password}
            onChange={handleInputChange}
          />
        </div>
      )}
    </div>
  );

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
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Date d'inscription</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Chargement des données...
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Aucun utilisateur trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.id}</TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-blue-100 text-blue-800"
                        }`}>
                          {user.role}
                        </span>
                      </TableCell>
                      <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(user.id)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleDelete(user.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Modifier un utilisateur</DialogTitle>
            <DialogDescription>
              Modifiez les informations de l'utilisateur
            </DialogDescription>
          </DialogHeader>
          
          {renderUserForm(false)}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSaveEdit}>
              <Save className="h-4 w-4 mr-2" />
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add User Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ajouter un utilisateur</DialogTitle>
            <DialogDescription>
              Créez un nouvel utilisateur dans votre système
            </DialogDescription>
          </DialogHeader>
          
          {renderUserForm(true)}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Annuler
            </Button>
            <Button 
              onClick={handleSaveAdd} 
              disabled={!currentUser.username || !currentUser.email || (currentUser.password && currentUser.password.length < 6)}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Ajouter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
