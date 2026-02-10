import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import type { GenerateRoadmapRequest } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

// GET /api/roadmaps
export function useRoadmaps() {
  return useQuery({
    queryKey: [api.roadmaps.list.path],
    queryFn: async () => {
      const res = await fetch(api.roadmaps.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch roadmaps");
      return api.roadmaps.list.responses[200].parse(await res.json());
    },
  });
}

// GET /api/roadmaps/:id
export function useRoadmap(id: number) {
  return useQuery({
    queryKey: [api.roadmaps.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.roadmaps.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch roadmap");
      return api.roadmaps.get.responses[200].parse(await res.json());
    },
    enabled: !!id && !isNaN(id),
  });
}

// POST /api/roadmaps/generate
export function useGenerateRoadmap() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: GenerateRoadmapRequest) => {
      const res = await fetch(api.roadmaps.generate.path, {
        method: api.roadmaps.generate.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || "Failed to generate roadmap");
      }
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.roadmaps.list.path] });
      toast({
        title: "Roadmap Generated!",
        description: "Your personalized learning path is ready.",
      });
    },
    onError: (error) => {
      toast({
        title: "Generation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

// DELETE /api/roadmaps/:id
export function useDeleteRoadmap() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.roadmaps.delete.path, { id });
      const res = await fetch(url, { 
        method: api.roadmaps.delete.method, 
        credentials: "include" 
      });
      if (!res.ok) throw new Error("Failed to delete roadmap");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.roadmaps.list.path] });
      toast({
        title: "Roadmap Deleted",
        description: "The roadmap has been removed from your dashboard.",
      });
    },
  });
}
