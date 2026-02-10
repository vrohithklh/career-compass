import { type Skill, type Resource } from "@shared/schema";
import { CheckCircle2, Circle, ChevronDown, ChevronUp, BookOpen, ExternalLink, PlayCircle, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useUpdateSkillStatus } from "@/hooks/use-skills";
import { Badge } from "@/components/ui/badge";

interface SkillCardProps {
  skill: Skill & { resources: Resource[] };
}

export function SkillCard({ skill }: SkillCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const updateStatus = useUpdateSkillStatus();

  const isCompleted = skill.status === "completed";
  const isInProgress = skill.status === "in-progress";

  const handleToggleStatus = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextStatus = isCompleted ? "pending" : "completed";
    updateStatus.mutate({ id: skill.id, status: nextStatus });
  };

  const getResourceIcon = (type: string | null) => {
    switch (type) {
      case "video": return <PlayCircle className="w-4 h-4" />;
      case "article": return <FileText className="w-4 h-4" />;
      case "course": return <BookOpen className="w-4 h-4" />;
      default: return <ExternalLink className="w-4 h-4" />;
    }
  };

  return (
    <motion.div 
      layout
      className={cn(
        "group relative rounded-xl border transition-all duration-300 overflow-hidden",
        isCompleted 
          ? "bg-primary/5 border-primary/20" 
          : "bg-card border-border hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
      )}
    >
      <div 
        className="p-4 flex items-start gap-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <button
          onClick={handleToggleStatus}
          disabled={updateStatus.isPending}
          className={cn(
            "mt-1 rounded-full p-1 transition-colors duration-200",
            isCompleted 
              ? "text-green-400 bg-green-400/10" 
              : "text-muted-foreground hover:text-primary hover:bg-primary/10"
          )}
        >
          {isCompleted ? (
            <CheckCircle2 className="w-6 h-6" />
          ) : (
            <Circle className="w-6 h-6" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={cn(
              "font-semibold text-lg leading-tight transition-colors",
              isCompleted ? "text-muted-foreground line-through decoration-primary/50" : "text-foreground group-hover:text-primary"
            )}>
              {skill.name}
            </h3>
            {skill.category && (
              <Badge variant="outline" className="text-[10px] h-5 px-1.5 uppercase tracking-wider bg-background/50">
                {skill.category}
              </Badge>
            )}
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-2">
            {skill.description}
          </p>

          {isInProgress && !isCompleted && (
            <Badge className="mt-2 bg-blue-500/10 text-blue-400 border-blue-500/20">
              In Progress
            </Badge>
          )}
        </div>

        <button 
          className="mt-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0 pl-[3.25rem]">
              <div className="h-px w-full bg-border/50 mb-4" />
              
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                <BookOpen className="w-3 h-3" />
                Recommended Resources
              </h4>

              <div className="space-y-2">
                {skill.resources.length > 0 ? (
                  skill.resources.map((resource) => (
                    <a
                      key={resource.id}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all group/resource"
                    >
                      <div className="text-primary/70 group-hover/resource:text-primary">
                        {getResourceIcon(resource.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate group-hover/resource:text-primary transition-colors">
                          {resource.title}
                        </p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {resource.type || 'Resource'}
                        </p>
                      </div>
                      <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover/resource:opacity-100 transition-opacity" />
                    </a>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    No specific resources added yet.
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
