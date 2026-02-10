import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

// PATCH /api/skills/:id/status
export function useUpdateSkillStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: 'pending' | 'in-progress' | 'completed' }) => {
      const url = buildUrl(api.skills.updateStatus.path, { id });
      const res = await fetch(url, {
        method: api.skills.updateStatus.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to update skill status");
      return api.skills.updateStatus.responses[200].parse(await res.json());
    },
    onSuccess: (_data, variables) => {
      // Invalidate the specific roadmap this skill belongs to
      // We'd ideally know the roadmap ID here, but invalidating all roadmap details is safe enough for now
      // Or we can rely on React Query's smart updates if we returned the full roadmap structure, 
      // but simpler to just refetch the active roadmap queries.
      queryClient.invalidateQueries({ queryKey: [api.roadmaps.get.path] });
      
      if (variables.status === 'completed') {
        toast({
          title: "Skill Completed! 🎉",
          description: "Great job making progress on your roadmap.",
        });
      }
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Could not update skill status. Please try again.",
        variant: "destructive",
      });
    },
  });
}
