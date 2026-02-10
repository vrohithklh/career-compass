import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

// GET /api/career-paths
export function useCareerPaths() {
  return useQuery({
    queryKey: [api.careerPaths.list.path],
    queryFn: async () => {
      const res = await fetch(api.careerPaths.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch career paths");
      return api.careerPaths.list.responses[200].parse(await res.json());
    },
  });
}
