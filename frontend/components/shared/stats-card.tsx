import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  description?: string;
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  description,
}: StatsCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              {title}
            </p>

            <h3 className="text-3xl font-bold">
              {value}
            </h3>

            {description && (
              <p className="text-xs text-muted-foreground">
                {description}
              </p>
            )}
          </div>

          {Icon && (
            <div className="rounded-lg bg-muted p-3">
              <Icon className="h-5 w-5" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}