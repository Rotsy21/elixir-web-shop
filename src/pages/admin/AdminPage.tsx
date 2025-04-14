
import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getProducts, getUsers, getContacts, getNewsletters } from "@/data/mockData";
import { Product, User, ContactMessage, Newsletter } from "@/models/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardCard from "@/components/dashboard/DashboardCard";
import {
  Users,
  Package,
  MessageSquare,
  Mail,
  BarChart3,
  Settings,
  PlusCircle,
  Download,
  X,
  Edit,
  Trash2,
  Search,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Import Recharts components
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function AdminPage() {
  const { user, isAdmin } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");

  // If not admin, redirect to home
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [productsData, usersData, contactsData, newslettersData] = await Promise.all([
          getProducts(),
          getUsers(),
          getContacts(),
          getNewsletters(),
        ]);

        setProducts(productsData);
        setUsers(usersData);
        setContacts(contactsData);
        setNewsletters(newslettersData);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Mock chart data
  const salesData = [
    { name: "Jan", sales: 4000 },
    { name: "Fév", sales: 3000 },
    { name: "Mar", sales: 5000 },
    { name: "Avr", sales: 2780 },
    { name: "Mai", sales: 1890 },
    { name: "Juin", sales: 2390 },
    { name: "Juil", sales: 3490 },
  ];

  const categoryData = [
    { name: "Eau", value: 400 },
    { name: "Soda", value: 300 },
    { name: "Thé", value: 300 },
    { name: "Jus", value: 200 },
    { name: "Limonade", value: 100 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  const visitorData = [
    { name: "Lun", visitors: 1000 },
    { name: "Mar", visitors: 1200 },
    { name: "Mer", visitors: 1500 },
    { name: "Jeu", visitors: 1000 },
    { name: "Ven", visitors: 1800 },
    { name: "Sam", visitors: 2000 },
    { name: "Dim", visitors: 1500 },
  ];

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">Tableau de bord Admin</h1>

          <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-8 bg-white p-1 rounded-md shadow-sm">
              <TabsTrigger value="dashboard" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                <BarChart3 className="h-4 w-4 mr-2" />
                Tableau de bord
              </TabsTrigger>
              <TabsTrigger value="products" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                <Package className="h-4 w-4 mr-2" />
                Produits
              </TabsTrigger>
              <TabsTrigger value="users" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                <Users className="h-4 w-4 mr-2" />
                Utilisateurs
              </TabsTrigger>
              <TabsTrigger value="contacts" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                <MessageSquare className="h-4 w-4 mr-2" />
                Messages
              </TabsTrigger>
              <TabsTrigger value="newsletters" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                <Mail className="h-4 w-4 mr-2" />
                Newsletter
              </TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                <Settings className="h-4 w-4 mr-2" />
                Paramètres
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
                <DashboardCard
                  title="Total Utilisateurs"
                  value={users.length}
                  icon={<Users className="h-4 w-4" />}
                  trend="up"
                  trendValue="+12.5%"
                />
                <DashboardCard
                  title="Total Produits"
                  value={products.length}
                  icon={<Package className="h-4 w-4" />}
                  trend="neutral"
                  trendValue="0%"
                />
                <DashboardCard
                  title="Messages"
                  value={contacts.length}
                  icon={<MessageSquare className="h-4 w-4" />}
                  trend="up"
                  trendValue="+5.2%"
                />
                <DashboardCard
                  title="Abonnés Newsletter"
                  value={newsletters.length}
                  icon={<Mail className="h-4 w-4" />}
                  trend="up"
                  trendValue="+7.4%"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Sales Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Ventes mensuelles</CardTitle>
                    <CardDescription>Evolution des ventes sur les 7 derniers mois</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={salesData}
                          margin={{
                            top: 10,
                            right: 30,
                            left: 0,
                            bottom: 0,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Area type="monotone" dataKey="sales" stroke="#8884d8" fill="#8884d8" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Category Distribution Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Distribution par catégories</CardTitle>
                    <CardDescription>Répartition des ventes par catégorie de produits</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {categoryData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Visitor Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle>Statistiques des visiteurs</CardTitle>
                  <CardDescription>Nombre de visiteurs uniques par jour</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={visitorData}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="visitors" fill="#00C49F" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="products">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Gestion des produits</CardTitle>
                    <CardDescription>
                      Gérez votre catalogue de produits
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Exporter
                    </Button>
                    <Button size="sm">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Ajouter un produit
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Rechercher un produit..." className="pl-8" />
                    </div>
                  </div>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Nom</TableHead>
                          <TableHead>Prix</TableHead>
                          <TableHead>Catégorie</TableHead>
                          <TableHead>Stock</TableHead>
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
                        ) : products.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-8">
                              Aucun produit trouvé
                            </TableCell>
                          </TableRow>
                        ) : (
                          products.map((product) => (
                            <TableRow key={product.id}>
                              <TableCell>{product.id}</TableCell>
                              <TableCell>{product.name}</TableCell>
                              <TableCell>{product.price.toFixed(2)} €</TableCell>
                              <TableCell>{product.category}</TableCell>
                              <TableCell>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  product.stock > 50
                                    ? "bg-green-100 text-green-800"
                                    : product.stock > 10
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                                }`}>
                                  {product.stock}
                                </span>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Button size="sm" variant="outline">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button size="sm" variant="outline" className="text-red-500 hover:text-red-700">
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
            </TabsContent>

            <TabsContent value="users">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Gestion des utilisateurs</CardTitle>
                    <CardDescription>
                      Gérez les utilisateurs de votre application
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Exporter
                    </Button>
                    <Button size="sm">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Ajouter un utilisateur
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Rechercher un utilisateur..." className="pl-8" />
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
                        ) : users.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-8">
                              Aucun utilisateur trouvé
                            </TableCell>
                          </TableRow>
                        ) : (
                          users.map((user) => (
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
                                  <Button size="sm" variant="outline">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button size="sm" variant="outline" className="text-red-500 hover:text-red-700">
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
            </TabsContent>

            <TabsContent value="contacts">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Messages de contact</CardTitle>
                    <CardDescription>
                      Gérez les messages envoyés par les utilisateurs
                    </CardDescription>
                  </div>
                  <Button size="sm" variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Exporter
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Rechercher un message..." className="pl-8" />
                    </div>
                  </div>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Nom</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Sujet</TableHead>
                          <TableHead>Date</TableHead>
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
                        ) : contacts.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-8">
                              Aucun message trouvé
                            </TableCell>
                          </TableRow>
                        ) : (
                          contacts.map((contact) => (
                            <TableRow key={contact.id}>
                              <TableCell>{contact.id}</TableCell>
                              <TableCell>{contact.name}</TableCell>
                              <TableCell>{contact.email}</TableCell>
                              <TableCell>{contact.subject}</TableCell>
                              <TableCell>{new Date(contact.createdAt).toLocaleDateString()}</TableCell>
                              <TableCell>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <span className="sr-only">Actions</span>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="h-4 w-4"
                                      >
                                        <circle cx="12" cy="12" r="1" />
                                        <circle cx="12" cy="5" r="1" />
                                        <circle cx="12" cy="19" r="1" />
                                      </svg>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem>Voir les détails</DropdownMenuItem>
                                    <DropdownMenuItem>Marquer comme lu</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-red-600">
                                      Supprimer
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="newsletters">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Abonnés Newsletter</CardTitle>
                    <CardDescription>
                      Gérez vos abonnés à la newsletter
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Exporter
                    </Button>
                    <Button size="sm">
                      <Mail className="mr-2 h-4 w-4" />
                      Envoyer Newsletter
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Rechercher un email..." className="pl-8" />
                    </div>
                  </div>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Date d'inscription</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {isLoading ? (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center py-8">
                              Chargement des données...
                            </TableCell>
                          </TableRow>
                        ) : newsletters.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center py-8">
                              Aucun abonné trouvé
                            </TableCell>
                          </TableRow>
                        ) : (
                          newsletters.map((newsletter) => (
                            <TableRow key={newsletter.id}>
                              <TableCell>{newsletter.id}</TableCell>
                              <TableCell>{newsletter.email}</TableCell>
                              <TableCell>{new Date(newsletter.createdAt).toLocaleDateString()}</TableCell>
                              <TableCell>
                                <Button size="sm" variant="outline" className="text-red-500 hover:text-red-700">
                                  <X className="h-4 w-4 mr-2" />
                                  Désabonner
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Paramètres</CardTitle>
                  <CardDescription>
                    Gérez les paramètres de votre application
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Nom de l'entreprise</label>
                      <Input defaultValue="Elixir Drinks" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email de contact</label>
                      <Input defaultValue="contact@elixir-drinks.com" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Téléphone</label>
                      <Input defaultValue="+33 1 23 45 67 89" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Adresse</label>
                      <Input defaultValue="123 Rue des Boissons, 75001 Paris, France" />
                    </div>
                    <div className="pt-4">
                      <Button type="button">Sauvegarder les modifications</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
