import { useCareerPaths } from "@/hooks/use-career-paths";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, TrendingUp, DollarSign, Briefcase } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function CareerExplorer() {
  const { data: careers, isLoading } = useCareerPaths();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
          AI Career Explorer
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover the most in-demand roles in the Artificial Intelligence industry and find the right path for you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {careers?.map((career, index) => (
          <motion.div
            key={career.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="h-full bg-card border-border hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                    {career.demandLevel} Demand
                  </Badge>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <DollarSign className="w-4 h-4 mr-1" />
                    {career.avgSalary}
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold">{career.title}</CardTitle>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col gap-6">
                <p className="text-muted-foreground leading-relaxed">
                  {career.description}
                </p>

                <div className="mt-auto">
                  <p className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-accent" />
                    Key Skills
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {career.skillsKeywords?.map((skill) => (
                      <span 
                        key={skill} 
                        className="text-xs px-2.5 py-1 rounded-md bg-secondary text-secondary-foreground border border-white/5"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                <Button asChild className="w-full mt-4" variant="secondary">
                  <Link href={`/generate?role=${encodeURIComponent(career.title)}`}>
                    <Briefcase className="w-4 h-4 mr-2" />
                    Build Roadmap
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
