
import { User } from "@/models/types";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UserFormProps {
  user: Partial<User>;
  onChange: (user: Partial<User>) => void;
  isAddMode: boolean;
}

export function UserForm({ user, onChange, isAddMode }: UserFormProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange({ ...user, [name]: value });
  };

  const handleRoleChange = (value: "admin" | "user") => {
    onChange({ ...user, role: value });
  };

  return (
    <div className="space-y-4 py-2">
      <div className="space-y-2">
        <label htmlFor="username" className="text-sm font-medium">Nom d'utilisateur</label>
        <Input 
          id="username"
          name="username"
          value={user.username || ''}
          onChange={handleInputChange}
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">Email</label>
        <Input 
          id="email"
          name="email"
          type="email"
          value={user.email || ''}
          onChange={handleInputChange}
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="role" className="text-sm font-medium">Rôle</label>
        <Select value={user.role || 'user'} onValueChange={handleRoleChange}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez un rôle" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="user">Utilisateur</SelectItem>
            <SelectItem value="admin">Administrateur</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {isAddMode && (
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">Mot de passe</label>
          <Input 
            id="password"
            name="password"
            type="password"
            value={user.password || ''}
            onChange={handleInputChange}
          />
        </div>
      )}
    </div>
  );
}
