import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card } from "@/components/ui/Card";
import { sampleNdviTrend, type NdviPoint } from "@/types";

export interface NdviTrendChartProps {
  data?: NdviPoint[];
}

export function NdviTrendChart({
  data = sampleNdviTrend,
}: NdviTrendChartProps) {
  return (
    <Card className="p-5" data-testid="ndvi-chart">
      <div>
        <h2 className="font-display text-base font-semibold text-surface-inverse">
          Vegetation index trend
        </h2>
        <p className="mt-1 text-sm text-earth-600">
          NDVI and NDRE across the latest sample flights.
        </p>
      </div>
      <div className="mt-4 h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 8, right: 12, bottom: 0, left: -16 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#dedbd0" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis domain={[0, 1]} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="ndvi"
              name="NDVI"
              stroke="#265830"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="ndre"
              name="NDRE"
              stroke="#b0814f"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
