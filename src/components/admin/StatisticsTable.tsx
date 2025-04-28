
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SiteStatistics } from "@/models/types";
import { Download, BarChart3, Calendar } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface StatisticsTableProps {
  statistics: SiteStatistics[];
  isLoading: boolean;
}

export function StatisticsTable({ statistics, isLoading }: StatisticsTableProps) {
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');

  // Filtrer les statistiques selon la période sélectionnée
  const filteredStatistics = statistics.filter(stat => stat.period === period);
  
  // Préparer les données pour le graphique
  const chartData = filteredStatistics.map(stat => ({
    date: typeof stat.date === 'string' ? stat.date : format(stat.date, 'dd/MM/yy', { locale: fr }),
    revenue: stat.totalRevenue,
    orders: stat.totalOrders,
    users: stat.activeUsers
  }));
  
  // Pour le taux de conversion on prend la dernière entrée disponible
  const latestStat = filteredStatistics.length > 0 
    ? filteredStatistics[filteredStatistics.length - 1] 
    : null;
  
  const handleExport = () => {
    // Logique d'exportation des statistiques (simulée)
    const exportData = JSON.stringify(statistics);
    const blob = new Blob([exportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `statistiques_${period}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Statistiques du site</CardTitle>
            <CardDescription>
              Performances et métriques d'utilisation
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Select value={period} onValueChange={(value: 'daily' | 'weekly' | 'monthly' | 'yearly') => setPeriod(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sélectionner une période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Quotidien</SelectItem>
                <SelectItem value="weekly">Hebdomadaire</SelectItem>
                <SelectItem value="monthly">Mensuel</SelectItem>
                <SelectItem value="yearly">Annuel</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Exporter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-80">
              Chargement des statistiques...
            </div>
          ) : filteredStatistics.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-80 text-center">
              <BarChart3 className="h-16 w-16 text-gray-300 mb-4" />
              <p className="text-lg font-medium text-gray-500">Aucune donnée disponible pour cette période</p>
              <p className="text-sm text-gray-400 mt-2">Essayez de changer la période ou revenez plus tard</p>
            </div>
          ) : (
            <>
              {/* Graphique d'évolution */}
              <div className="h-80 mb-8">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={chartData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#8884d8"
                      fillOpacity={1}
                      fill="url(#colorRevenue)"
                      name="Revenu (€)"
                    />
                    <Area
                      type="monotone"
                      dataKey="orders"
                      stroke="#82ca9d"
                      fillOpacity={1}
                      fill="url(#colorOrders)"
                      name="Commandes"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Tableau des métriques clés */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Utilisateurs actifs</TableHead>
                      <TableHead>Commandes</TableHead>
                      <TableHead>Revenu</TableHead>
                      <TableHead>Panier moyen</TableHead>
                      <TableHead>Conversion</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStatistics.map((stat, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div className="flex items-center">
                            <Calendar className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
                            <span>
                              {typeof stat.date === 'string' 
                                ? format(new Date(stat.date), 'dd MMM yyyy', { locale: fr })
                                : format(stat.date, 'dd MMM yyyy', { locale: fr })}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{stat.activeUsers}</TableCell>
                        <TableCell>{stat.totalOrders}</TableCell>
                        <TableCell>{stat.totalRevenue.toFixed(2)} €</TableCell>
                        <TableCell>{stat.averageOrderValue.toFixed(2)} €</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            stat.conversionRate > 3 
                              ? "bg-green-100 text-green-800" 
                              : stat.conversionRate > 1
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}>
                            {stat.conversionRate.toFixed(2)}%
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </>
  );
}
