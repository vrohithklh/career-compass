import { useSearch } from "wouter";
import { useCareerPaths } from "@/hooks/use-career-paths";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Loader2, DollarSign, TrendingUp } from "lucide-react";

export default function CareerResults() {
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const interest = params.get("interest");
  
  const { data: careers, isLoading } = useCareerPaths();

  // Simple matching logic for demo purposes
  const recommended = careers?.filter(c => {
    if (interest === 'ml-engineer') return c.title === 'Machine Learning Engineer';
    if (interest === 'data-scientist') return c.title === 'Data Scientist';
    if (interest === 'product-manager') return c.title === 'AI Product Manager';
    if (interest === 'nlp-engineer') return c.title === 'NLP Engineer';
    return true;
  }) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-medium mb-6"
        >
          <Sparkles className="w-4 h-4" />
          <span>AI Recommendations Ready</span>
        </motion.div>
        <h1 className="text-5xl font-display font-bold text-white mb-4">Your AI Career Path</h1>
        <p className="text-xl text-muted-foreground">Based on your assessment, we've identified the best roles for your skills and interests.</p>
      </div>

      <div className="space-y-8">
        {recommended.map((career, index) => (
          <motion.div
            key={career.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-card border-border overflow-hidden group">
              <div className="grid md:grid-cols-[1fr_200px] gap-6">
                <div className="p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <Badge className="bg-primary/20 text-primary border-primary/30">{career.demandLevel} Demand</Badge>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <DollarSign className="w-4 h-4 mr-1" />
                      {career.avgSalary}
                    </div>
                  </div>
                  <CardTitle className="text-3xl font-bold mb-4">{career.title}</CardTitle>
                  <CardDescription className="text-lg text-muted-foreground mb-6">
                    {career.description}
                  </CardDescription>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {career.skillsKeywords?.map((skill) => (
                      <Badge key={skill} variant="secondary" className="bg-secondary/50">{skill}</Badge>
                    ))}
                  </div>
                  <Button asChild size="lg" className="gradient-primary">
                    <Link href={`/generate?role=${encodeURIComponent(career.title)}`}>
                      Generate Detailed Roadmap
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>
                <div className="bg-primary/5 p-8 flex flex-col justify-center items-center text-center border-l border-border">
                  <TrendingUp className="w-12 h-12 text-primary mb-4" />
                  <span className="text-sm font-medium text-muted-foreground mb-1">Growth Index</span>
                  <span className="text-3xl font-bold text-white">94%</span>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
