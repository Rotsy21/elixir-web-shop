
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  description?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
}

export default function DashboardCard({
  title,
  value,
  icon,
  description,
  trend,
  trendValue,
}: DashboardCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        
        {trend && trendValue && (
          <div className="flex items-center mt-2">
            <div
              className={`flex items-center text-xs ${
                trend === "up" 
                  ? "text-green-500" 
                  : trend === "down" 
                  ? "text-red-500" 
                  : "text-gray-500"
              }`}
            >
              {trend === "up" ? (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1">
                  <path d="M6 2.5L9.5 6L8.5 7L6.5 5V9.5H5.5V5L3.5 7L2.5 6L6 2.5Z" fill="currentColor" />
                </svg>
              ) : trend === "down" ? (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1">
                  <path d="M6 9.5L2.5 6L3.5 5L5.5 7V2.5H6.5V7L8.5 5L9.5 6L6 9.5Z" fill="currentColor" />
                </svg>
              ) : (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1">
                  <path d="M3 6H9" stroke="currentColor" strokeWidth="1" />
                </svg>
              )}
              <span>{trendValue}</span>
            </div>
            <span className="text-xs text-muted-foreground ml-1">vs. mois dernier</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
