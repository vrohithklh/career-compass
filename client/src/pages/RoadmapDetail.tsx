import { useRoadmap } from "@/hooks/use-roadmaps";
import { useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, Trophy } from "lucide-react";
import { SkillCard } from "@/components/SkillCard";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

export default function RoadmapDetail() {
  const [match, params] = useRoute("/roadmap/:id");
  const id = parseInt(params?.id || "0");
  const { data: roadmap, isLoading, error } = useRoadmap(id);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  if (error || !roadmap) {
    return (
      <div className="max-w-md mx-auto mt-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Roadmap Not Found</h2>
        <Button asChild variant="outline">
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    );
  }

  const completedSkills = roadmap.skills.filter(s => s.status === 'completed').length;
  const totalSkills = roadmap.skills.length;
  const progress = totalSkills > 0 ? (completedSkills / totalSkills) * 100 : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Button asChild variant="ghost" className="mb-8 pl-0 text-muted-foreground hover:text-white">
        <Link href="/dashboard">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>
      </Button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h1 className="text-4xl font-display font-bold text-white mb-2">{roadmap.role}</h1>
              <p className="text-xl text-muted-foreground">{roadmap.goal}</p>
            </div>
            {progress === 100 && (
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                <Trophy className="w-5 h-5" />
                <span className="font-bold">Completed!</span>
              </div>
            )}
          </div>

          <div className="bg-card border border-border rounded-xl p-6 mb-12">
            <div className="flex justify-between items-end mb-2">
              <span className="text-sm font-medium text-muted-foreground">Progress</span>
              <span className="text-2xl font-bold text-primary">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-3 bg-secondary" />
            <div className="mt-2 text-xs text-muted-foreground text-right">
              {completedSkills} of {totalSkills} skills mastered
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              Your Learning Path
              <span className="text-sm font-normal text-muted-foreground bg-secondary px-2 py-1 rounded-md ml-2">
                {totalSkills} Steps
              </span>
            </h2>
            
            {roadmap.skills
              .sort((a, b) => (a.order || 0) - (b.order || 0))
              .map((skill, index) => (
                <motion.div
                  key={skill.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <SkillCard skill={skill} />
                  {index < roadmap.skills.length - 1 && (
                    <div className="h-6 w-px bg-border ml-8 my-1" />
                  )}
                </motion.div>
              ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
