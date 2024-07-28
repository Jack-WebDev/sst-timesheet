import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "lucide-react";
import {IconType} from "react-icons";

type DashboardCardProps = {
  icon: typeof Icon | IconType;
  total: number;
  title: string;
}

export default function DashboardCard({ icon: Icon, total, title }: DashboardCardProps) {
  return (
    <Card className="border border-primary">
      <CardHeader>
        <CardTitle className="flex items-center gap-x-4 text-secondary font-bold">
          <Icon fontSize="2rem" iconNode={[]} fill="#dda83a" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <h2 className="font-semibold">{total}</h2>
      </CardContent>
    </Card>
  );
}
