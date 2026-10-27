import { useQuery } from "@tanstack/react-query";

import { api } from "@/api/client";
import { Badge } from "@/components/ui/Badge";

interface HealthResponse {
  status: string;
  service: string;
}

export function HealthBadge() {
  const { data, isPending, isError } = useQuery({
    queryKey: ["health"],
    queryFn: async () => {
      const response = await api.get<HealthResponse>("/health/");

      return response.data;
    },
    retry: false,
  });

  if (isPending) {
    return <Badge tone="neutral">Checking...</Badge>;
  }

  if (isError || data?.status !== "ok") {
    return <Badge tone="danger">Unavailable</Badge>;
  }

  return <Badge tone="success">Operational</Badge>;
}
