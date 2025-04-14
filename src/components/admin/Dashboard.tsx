
import { BarChart3, Users, Package, MessageSquare, Mail } from "lucide-react";
import { Product, User, ContactMessage, Newsletter } from "@/models/types";
import DashboardCard from "@/components/dashboard/DashboardCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

interface DashboardProps {
  products: Product[];
  users: User[];
  contacts: ContactMessage[];
  newsletters: Newsletter[];
}

export function Dashboard({ products, users, contacts, newsletters }: DashboardProps) {
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
    <>
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
    </>
  );
}
